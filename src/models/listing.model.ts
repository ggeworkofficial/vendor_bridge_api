import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import User from "./user.model";
import Category from "./category.model";
import Inventory from "./inventory.model";
import ListingMedia from "./listing-media.model";
import ListingPriceTier from "./listing-price-tier.model";

export type ListingKind = 'product' | 'service' | 'skill';
export type ListingPriceModel = 'fixed' | 'hourly' | 'daily' | 'project';
export type ListingStatus = 'under_review' | 'published' | 'flagged' | 'banned';

export interface ListingAttributes {
  id: string;
  user_id: string;
  kind: ListingKind;
  title: string;
  description: string;
  price: number;
  price_model: ListingPriceModel;
  quantity: number;
  category_id?: string;
  location?: string;
  tags?: string[];
  status: ListingStatus;
  moderation_note?: string;
  reviewed_by?: string;
  reviewed_at?: Date;
  product_id?: string;
  bulk_enabled: boolean;
  bulk_only: boolean;
  moq: number;
  commission_enabled: boolean;
  commission_percent: number;
  created_at?: Date;
  updated_at?: Date;
}

interface ListingCreationAttributes extends Optional<ListingAttributes, "quantity" | "status" | "bulk_enabled" | "bulk_only" | "moq" | "commission_enabled" | "commission_percent" | "created_at" | "updated_at"> {}

@Table({
  tableName: "listings",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Listing extends Model<ListingAttributes, ListingCreationAttributes> implements ListingAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  user_id!: string;

  @BelongsTo(() => User, 'user_id')
  owner?: User;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM('product', 'service', 'skill'),
  })
  kind!: ListingKind;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(160),
  })
  title!: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  description!: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
  })
  price!: number;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM('fixed', 'hourly', 'daily', 'project'),
  })
  price_model!: ListingPriceModel;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  quantity!: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
  })
  category_id?: string;

  @BelongsTo(() => Category)
  category?: Category;

  @Column({
    type: DataType.STRING(120),
  })
  location?: string;

  @Column({
    type: DataType.JSON,
  })
  tags?: string[];

  @Default('under_review')
  @Column({
    type: DataType.ENUM('under_review', 'published', 'flagged', 'banned'),
  })
  status!: ListingStatus;

  @Column({
    type: DataType.TEXT,
  })
  moderation_note?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  reviewed_by?: string;

  @BelongsTo(() => User, 'reviewed_by')
  reviewer?: User;

  @Column({
    type: DataType.DATE,
  })
  reviewed_at?: Date;

  @ForeignKey(() => Inventory)
  @Column({
    type: DataType.UUID,
  })
  product_id?: string;

  @BelongsTo(() => Inventory)
  product?: Inventory;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  bulk_enabled!: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  bulk_only!: boolean;

  @Default(1)
  @Column({
    type: DataType.INTEGER,
  })
  moq!: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  commission_enabled!: boolean;

  @Default(0)
  @Column({
    type: DataType.DECIMAL(5, 2),
  })
  commission_percent!: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updated_at!: Date;

  @HasMany(() => ListingMedia)
  media?: ListingMedia[];

  @HasMany(() => ListingPriceTier)
  tiers?: ListingPriceTier[];
}
