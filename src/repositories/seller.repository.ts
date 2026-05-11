import { Seller, User } from "../models";


interface CreateSeller {
    id: string;
    user_id: string;
    name?: string;
    location?: string;
    contact?: string;
    verified: boolean;
    created_at: Date;
    updated_at: Date;
}

interface UpdateSeller {
    id: string;
    user_id?: string;
    name?: string;
    location?: string;
    contact?: string;
    verified?: boolean;
    updated_at: Date;
}

export interface SellerCreateResult {
    id: string;
    user_id?: string;
    name?: string;
    location?: string;
    contact?: string;
    verified: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface SellerResult {
    id: string;
    user: {id: string | undefined, name: string | undefined} | null;
    name?: string;
    location?: string;
    contact?: string;
    verified: boolean;
    created_at: Date;
    updated_at: Date;
}

export const mapSellerData = (seller: any): SellerResult => {
    return {
    id: seller.id,
    name: seller.name || "",
    location: seller.location || "",
    contact: seller.contact || "",
    verified: seller.verified,
    created_at: seller.created_at,
    updated_at: seller.updated_at,
    user: seller.user
      ? {
          id: seller.user.id,
          name: seller.user.full_name
        }
      : null
  };
}

export const createSeller = async (input: CreateSeller): Promise<SellerCreateResult> => {
    return await Seller.create(input);
};

export const getSellerById = async (id: string): Promise<SellerResult | null> => {
    const seller =  await Seller.findByPk(id, {
        include: [{
            model: User, attributes: ["id", "full_name"]
        }]
    });
    if (!seller) return null;   

    return mapSellerData(seller);
};

export const getAllSellers = async (): Promise<SellerResult[]> => {
    const sellers = await Seller.findAll({
        include: [{
            model: User, attributes: ["id", "full_name"]
        }]
    });

    return sellers.map(seller => mapSellerData(seller));
};

export const updateSeller = async (input: UpdateSeller): Promise<SellerCreateResult | null> => {
    const seller = await Seller.findByPk(input.id);
    if (!seller) {
        return null;
    }
    await seller.update(input);
    return seller;
};

export const deleteSeller = async (id: string): Promise<boolean> => {
    const deletedCount = await Seller.destroy({ where: { id } });
    return deletedCount > 0;
};