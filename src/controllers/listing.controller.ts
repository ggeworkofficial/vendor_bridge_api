import { Request, Response } from 'express';
import { Listing, ListingMedia, ListingPriceTier, Inventory, User, Seller } from '../models';
import Postgres from '../connection/postgres';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';

export class ListingController {
  public async createListing(req: Request, res: Response): Promise<void> {
    const transaction = await Postgres.sequelize.transaction();
    try {
      const user_id = req.user!.id;
      const {
        kind, title, description, price, price_model, quantity, category_id, location, tags,
        bulk_enabled, bulk_only, moq, tiers, commission_enabled, commission_percent
      } = req.body;

      const listing = await Listing.create({
        id: crypto.randomUUID(),
        user_id,
        kind,
        title,
        description,
        price,
        price_model: price_model || (kind === 'product' ? 'fixed' : 'hourly'),
        quantity: quantity || 0,
        category_id: category_id || null,
        location: location || null,
        tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : null,
        status: 'under_review',
        bulk_enabled: bulk_enabled === 'true' || bulk_enabled === true,
        bulk_only: bulk_only === 'true' || bulk_only === true,
        moq: moq || 1,
        commission_enabled: commission_enabled === 'true' || commission_enabled === true,
        commission_percent: commission_percent || 0,
      }, { transaction });

      // Handle media
      const files = req.files as Express.Multer.File[];
      if (files && files.length > 0) {
        const mediaPromises = files.map((file, index) => {
          return ListingMedia.create({
            id: crypto.randomUUID(),
            listing_id: listing.id,
            url: `/uploads/${file.filename}`,
            file_name: file.filename,
            kind: kind === 'product' ? 'image' : 'portfolio',
            is_primary: index === 0,
            position: index,
          }, { transaction });
        });
        await Promise.all(mediaPromises);
      }

      // Handle tiers
      if (tiers) {
        const parsedTiers = typeof tiers === 'string' ? JSON.parse(tiers) : tiers;
        if (Array.isArray(parsedTiers)) {
          const tierPromises = parsedTiers.map(tier => {
            return ListingPriceTier.create({
              id: crypto.randomUUID(),
              listing_id: listing.id,
              min_qty: tier.min_qty,
              unit_price: tier.unit_price,
            }, { transaction });
          });
          await Promise.all(tierPromises);
        }
      }

      await transaction.commit();
      
      const createdListing = await Listing.findByPk(listing.id, {
        include: [ListingMedia, ListingPriceTier, { model: User, as: 'owner', attributes: ['id', 'full_name'] }]
      });

      res.status(201).json({ success: true, message: 'Listing submitted for review', data: createdListing });
    } catch (error: any) {
      await transaction.rollback();
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to create listing', errors: [error.message] });
    }
  }

  public async getListings(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, kind, status, search, category_id, user_id, seller_id, bulk, commission, sort, order } = req.query;
      
      const whereClause: any = {};
      
      if (status) {
        // Only admin can filter by non-published generally, unless it's their own which is handled in /my
        if (req.user?.role !== 'admin' && status !== 'published') {
          return Object.assign(res.status(403).json({ success: false, message: 'Forbidden' }));
        }
        whereClause.status = status;
      } else {
        // default to published for public view
        if (req.user?.role !== 'admin') {
          whereClause.status = 'published';
        }
      }

      if (kind) whereClause.kind = kind;
      if (category_id) whereClause.category_id = category_id;
      if (user_id) whereClause.user_id = user_id;
      if (bulk) whereClause.bulk_enabled = bulk === 'true';
      if (commission) whereClause.commission_enabled = commission === 'true';

      if (search) {
        whereClause.title = { [Op.iLike]: `%${search}%` };
      }

      // if seller_id is provided, we need to find the user_id associated with this seller
      if (seller_id) {
        const seller = await Seller.findByPk(seller_id as string);
        if (seller) {
          whereClause.user_id = seller.user_id;
        } else {
          res.status(404).json({ success: false, message: 'Seller not found' });
          return;
        }
      }

      let orderClause: any = [['created_at', 'DESC']];
      if (sort) {
        const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
        if (sort === 'price') orderClause = [['price', sortOrder]];
        if (sort === 'title') orderClause = [['title', sortOrder]];
        if (sort === 'created_at') orderClause = [['created_at', sortOrder]];
      }

      const offset = (Number(page) - 1) * Number(limit);

      const { rows, count } = await Listing.findAndCountAll({
        where: whereClause,
        include: [
          { model: ListingMedia, separate: true, order: [['position', 'ASC']] },
          { model: ListingPriceTier, separate: true, order: [['min_qty', 'ASC']] },
          { model: User, as: 'owner', attributes: ['id', 'full_name'] }
        ],
        limit: Number(limit),
        offset,
        order: orderClause
      });

      res.status(200).json({
        data: rows,
        meta: {
          page: Number(page),
          limit: Number(limit),
          total: count
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching listings', errors: [error.message] });
    }
  }

  public async getMyListings(req: Request, res: Response): Promise<void> {
    try {
      const user_id = req.user!.id;
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { rows, count } = await Listing.findAndCountAll({
        where: { user_id },
        include: [
          { model: ListingMedia, separate: true, order: [['position', 'ASC']] },
          { model: ListingPriceTier, separate: true, order: [['min_qty', 'ASC']] }
        ],
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']]
      });

      res.status(200).json({
        data: rows,
        meta: {
          page: Number(page),
          limit: Number(limit),
          total: count
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching listings', errors: [error.message] });
    }
  }

  public async getListing(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const listing = await Listing.findByPk(id as string, {
        include: [
          { model: ListingMedia, separate: true, order: [['position', 'ASC']] },
          { model: ListingPriceTier, separate: true, order: [['min_qty', 'ASC']] },
          { model: User, as: 'owner', attributes: ['id', 'full_name'] }
        ]
      });

      if (!listing) {
        res.status(404).json({ success: false, message: 'Listing not found' });
        return;
      }

      if (listing.status !== 'published' && req.user?.role !== 'admin' && req.user?.id !== listing.user_id) {
        res.status(403).json({ success: false, message: 'Listing not available' });
        return;
      }

      res.status(200).json({ data: listing });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching listing', errors: [error.message] });
    }
  }

  public async getListingByProduct(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const listing = await Listing.findOne({
        where: { product_id: productId },
        include: [
          { model: ListingPriceTier, separate: true, order: [['min_qty', 'ASC']] }
        ]
      });

      res.status(200).json({ data: listing }); // Returns null if not found
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching listing', errors: [error.message] });
    }
  }

  public async updateListing(req: Request, res: Response): Promise<void> {
    const transaction = await Postgres.sequelize.transaction();
    try {
      const { id } = req.params;
      const user_id = req.user!.id;
      
      const listing = await Listing.findByPk(id as string);
      if (!listing) {
        res.status(404).json({ success: false, message: 'Listing not found' });
        return;
      }

      if (listing.user_id !== user_id && req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Not authorized' });
        return;
      }
      
      if (listing.status === 'banned' && req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Cannot edit a banned listing' });
        return;
      }

      const {
        title, description, price, price_model, quantity, category_id, location, tags,
        bulk_enabled, bulk_only, moq, tiers, commission_enabled, commission_percent
      } = req.body;

      await listing.update({
        title: title || listing.title,
        description: description || listing.description,
        price: price || listing.price,
        price_model: price_model || listing.price_model,
        quantity: quantity !== undefined ? quantity : listing.quantity,
        category_id: category_id !== undefined ? category_id : listing.category_id,
        location: location !== undefined ? location : listing.location,
        tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : listing.tags,
        status: 'under_review', // Edits revert to under_review
        moderation_note: null as any,
        bulk_enabled: bulk_enabled !== undefined ? (bulk_enabled === 'true' || bulk_enabled === true) : listing.bulk_enabled,
        bulk_only: bulk_only !== undefined ? (bulk_only === 'true' || bulk_only === true) : listing.bulk_only,
        moq: moq !== undefined ? moq : listing.moq,
        commission_enabled: commission_enabled !== undefined ? (commission_enabled === 'true' || commission_enabled === true) : listing.commission_enabled,
        commission_percent: commission_percent !== undefined ? commission_percent : listing.commission_percent,
      }, { transaction });

      // Handle media updates (simplistic: if new files provided, append them. In a real app, we'd handle replacements/deletions)
      const files = req.files as Express.Multer.File[];
      if (files && files.length > 0) {
        const mediaPromises = files.map((file, index) => {
          return ListingMedia.create({
            id: crypto.randomUUID(),
            listing_id: listing.id,
            url: `/uploads/${file.filename}`,
            file_name: file.filename,
            kind: listing.kind === 'product' ? 'image' : 'portfolio',
            is_primary: false,
            position: 99, // append
          }, { transaction });
        });
        await Promise.all(mediaPromises);
      }

      if (tiers) {
        const parsedTiers = typeof tiers === 'string' ? JSON.parse(tiers) : tiers;
        if (Array.isArray(parsedTiers)) {
          await ListingPriceTier.destroy({ where: { listing_id: listing.id }, transaction });
          const tierPromises = parsedTiers.map(tier => {
            return ListingPriceTier.create({
              id: crypto.randomUUID(),
              listing_id: listing.id,
              min_qty: tier.min_qty,
              unit_price: tier.unit_price,
            }, { transaction });
          });
          await Promise.all(tierPromises);
        }
      }

      await transaction.commit();
      
      const updatedListing = await Listing.findByPk(id as string, {
        include: [ListingMedia, ListingPriceTier, { model: User, as: 'owner', attributes: ['id', 'full_name'] }]
      });

      res.status(200).json({ success: true, message: 'Listing updated and is under review', data: updatedListing });
    } catch (error: any) {
      await transaction.rollback();
      res.status(500).json({ success: false, message: 'Failed to update listing', errors: [error.message] });
    }
  }

  public async deleteListing(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const listing = await Listing.findByPk(id as string);
      
      if (!listing) {
        res.status(404).json({ success: false, message: 'Listing not found' });
        return;
      }

      if (listing.user_id !== req.user!.id && req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Not authorized' });
        return;
      }

      await listing.destroy();
      res.status(200).json({ success: true, message: 'Listing deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error deleting listing', errors: [error.message] });
    }
  }

  public async moderateListing(req: Request, res: Response): Promise<void> {
    const transaction = await Postgres.sequelize.transaction();
    try {
      const { id } = req.params;
      const { action, note } = req.body; // action: approve | flag | ban

      if (!['approve', 'flag', 'ban'].includes(action)) {
        res.status(400).json({ success: false, message: 'Invalid action' });
        return;
      }

      const listing = await Listing.findByPk(id as string);
      if (!listing) {
        res.status(404).json({ success: false, message: 'Listing not found' });
        return;
      }

      let status = listing.status;
      if (action === 'approve') status = 'published';
      if (action === 'flag') status = 'flagged';
      if (action === 'ban') status = 'banned';

      await listing.update({
        status,
        moderation_note: note || null,
        reviewed_by: req.user!.id,
        reviewed_at: new Date()
      }, { transaction });

      // If approved and it's a product, sync to inventory
      if (action === 'approve' && listing.kind === 'product') {
        const primaryMedia = await ListingMedia.findOne({ where: { listing_id: listing.id, is_primary: true } });
        
        let inventoryProduct;
        if (listing.product_id) {
          inventoryProduct = await Inventory.findByPk(listing.product_id);
          if (inventoryProduct) {
            await inventoryProduct.update({
              name: listing.title,
              description: listing.description,
              price: listing.price,
              quantity: listing.quantity,
              category_id: listing.category_id ?? null as any,
              location: listing.location ?? null as any
            }, { transaction });
          }
        } 
        
        if (!inventoryProduct) {
          // If the seller profile doesn't exist for the user, this might fail unless we create it or handle seller logic.
          // For now, assuming the seller exists or we find one:
          const seller = await Seller.findOne({ where: { user_id: listing.user_id } });
          const sellerId = seller ? seller.id : null;

          inventoryProduct = await Inventory.create({
            id: crypto.randomUUID(),
            name: listing.title,
            description: listing.description,
            price: listing.price,
            quantity: listing.quantity,
            quality_label: 'high', // default
            category_id: listing.category_id ?? null as any,
            seller_id: sellerId ?? null as any,
            location: listing.location ?? null as any,
            verified: true,
          }, { transaction });

          await listing.update({ product_id: inventoryProduct.id }, { transaction });
        }
      }

      await transaction.commit();
      res.status(200).json({ success: true, message: `Listing ${action}d` });
    } catch (error: any) {
      await transaction.rollback();
      res.status(500).json({ success: false, message: 'Error moderating listing', errors: [error.message] });
    }
  }
}
