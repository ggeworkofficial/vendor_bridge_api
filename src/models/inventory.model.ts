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
import Category from "./category.model";
import Seller from "./seller.model";
import ProductImage from "./product-image.model";
import Review from "./review.model";
import CartItem from "./cart-item.model";
import OrderItem from "./order-item.model";

export type QualityLable = 'high' | 'medium' | 'low';
interface InventoryAttributes {
  id: string;
  name: string;
  description?: string;
  price: number;
  quality_label: QualityLable;
  quantity: number;
  verified?: boolean;
  category_id?: string;
  seller_id?: string;
  location?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface InventoryCreationAttributes extends Optional<InventoryAttributes, "description"  | "verified" | "location" | "created_at" | "updated_at"> {}

@Table({
  tableName: "inventory",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
  })
  description?: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL,
  })
  price!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  quality_label!: QualityLable;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.NUMBER,
  })
  quantity!: number;

  @Default(false)
  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  verified!: boolean;

  @ForeignKey(() => Category)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
  })
  category_id!: string;

  @BelongsTo(() => Category)
  category?: Category;

  @ForeignKey(() => Seller)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
  })
  seller_id!: string;

  @BelongsTo(() => Seller)
  seller?: Seller;

  @Column({
    type: DataType.STRING(255),
  })
  location?: string;

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

  @HasMany(() => ProductImage)
  images?: ProductImage[];

  @HasMany(() => Review)
  reviews?: Review[];

  @HasMany(() => CartItem)
  cartItems?: CartItem[];

  @HasMany(() => OrderItem)
  orderItems?: OrderItem[];

}
