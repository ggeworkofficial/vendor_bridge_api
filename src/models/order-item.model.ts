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
import Order from "./order.model";
import Inventory from "./inventory.model";
import Listing from "./listing.model";

interface OrderItemAttributes {
  id: string;
  order_id?: string;
  product_id?: string;
  listing_id?: string | null;
  quantity: number;
  price: number;
  unit_price: number;
  created_at?: Date;
  updated_at?: Date;
}

interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, "created_at" | "updated_at"> {}

@Table({
  tableName: "order_items",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    {
      name: "order_items_order_id_product_id_unique",
      unique: true,
      fields: ["order_id", "product_id"],
    },
  ],
})
export default class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUID,
  })
  order_id?: string;

  @BelongsTo(() => Order)
  order?: Order;

  @ForeignKey(() => Inventory)
  @Column({
    type: DataType.UUID,
  })
  product_id?: string;

  @BelongsTo(() => Inventory)
  product?: Inventory;

  @ForeignKey(() => Listing)
  @Column({
    type: DataType.UUID,
  })
  listing_id?: string;

  @BelongsTo(() => Listing)
  listing?: Listing;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 1,
    },
  })
  quantity!: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  price!: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
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
