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
import Inventory from "./inventory.model";

interface ProductImageAttributes {
  id: string;
  product_id: string;
  image_url: string;
  is_primary?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface ProductImageCreationAttributes extends Optional<ProductImageAttributes, "is_primary" | "created_at" | "updated_at"> {}

@Table({
  tableName: "product_images",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class ProductImage extends Model<ProductImageAttributes, ProductImageCreationAttributes> implements ProductImageAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => Inventory)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
  })
  product_id!: string;

  @BelongsTo(() => Inventory)
  product?: Inventory;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  image_url!: string;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN
  })
  is_primary?: boolean;

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
