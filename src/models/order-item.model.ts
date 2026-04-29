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

interface OrderItemAttributes {
  id: string;
  order_id?: string;
  product_id?: string;
  quantity: number;
  price: string;
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
  price!: string;

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
