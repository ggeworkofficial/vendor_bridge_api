import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import Listing from "./listing.model";

export type ListingMediaKind = 'image' | 'portfolio';

export interface ListingMediaAttributes {
  id: string;
  listing_id: string;
  url: string;
  file_name?: string;
  kind: ListingMediaKind;
  is_primary: boolean;
  position: number;
  created_at?: Date;
  updated_at?: Date;
}

interface ListingMediaCreationAttributes extends Optional<ListingMediaAttributes, "is_primary" | "position" | "created_at" | "updated_at"> {}

@Table({
  tableName: "listing_media",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class ListingMedia extends Model<ListingMediaAttributes, ListingMediaCreationAttributes> implements ListingMediaAttributes {
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
    type: DataType.STRING,
  })
  url!: string;

  @Column({
    type: DataType.STRING,
  })
  file_name?: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM('image', 'portfolio'),
  })
  kind!: ListingMediaKind;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  is_primary!: boolean;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  position!: number;

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
