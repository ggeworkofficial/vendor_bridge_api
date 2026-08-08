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
import Cart from "./cart.model";
import Inventory from "./inventory.model";

interface CartItemAttributes {
  id: string;
  cart_id?: string;
  product_id?: string;
  quantity: number;
  created_at?: Date;
  updated_at?: Date;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, "created_at" | "updated_at"> {}

@Table({
  tableName: "cart_items",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    {
      name: "cart_items_cart_id_product_id_unique",
      unique: true,
      fields: ["cart_id", "product_id"],
    },
  ],
})
export default class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => Cart)
  @Column({
    type: DataType.UUID,
  })
  cart_id?: string;

  @BelongsTo(() => Cart)
  cart?: Cart;

  @ForeignKey(() => Inventory)
  @Column({
    type: DataType.UUID,
  })
  product_id?: string;

  @BelongsTo(() => Inventory)
  product?: Inventory;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 1,
    },
  })
  quantity!: number;

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
