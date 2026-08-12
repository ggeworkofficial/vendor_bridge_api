import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import Listing from "./listing.model";

export interface ListingPriceTierAttributes {
  id: string;
  listing_id: string;
  min_qty: number;
  unit_price: number;
  created_at?: Date;
  updated_at?: Date;
}

interface ListingPriceTierCreationAttributes extends Optional<ListingPriceTierAttributes, "created_at" | "updated_at"> {}

@Table({
  tableName: "listing_price_tiers",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    {
      name: "unique_listing_min_qty",
      unique: true,
      fields: ["listing_id", "min_qty"],
    },
  ],
})
export default class ListingPriceTier extends Model<ListingPriceTierAttributes, ListingPriceTierCreationAttributes> implements ListingPriceTierAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ForeignKey(() => Listing)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  listing_id!: string;

  @BelongsTo(() => Listing)
  listing?: Listing;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  min_qty!: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
  })
  unit_price!: number;

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
}
