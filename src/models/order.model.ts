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
  HasMany,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import User from "./user.model";
import OrderItem from "./order-item.model";
import Receipt from "./receipt.model";
import Logistics from "./logistics.model";
import Complaint from "./complaint.model";

export type OrderStatus = 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'rejected';
export type PaymentStatus = 'paid' | 'unpaid' | 'pending_review' | 'rejected';
export type PaymentMethod = 'full' | 'advance' | 'cod';
interface OrderAttributes {
  id: string;
  user_id?: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  total_amount: number;
  address: string;
  estimated_delivery?: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "estimated_delivery" | "created_at" | "updated_at"> {}

@Table({
  tableName: "orders",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  user_id?: string;

  @BelongsTo(() => User)
  user?: User;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(30),
    validate: {
      isIn: [["pending", "confirmed", "out_for_delivery", "delivered", "cancelled", "rejected"]],
    },
  })
  status!: OrderStatus;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [["paid", "unpaid", 'pending_review', 'rejected']],
    },
  })
  payment_status!: PaymentStatus;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [["full", "advance", "cod"]],
    },
  })
  payment_method!: PaymentMethod;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  total_amount!: number;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  address!: string;

  @Column({
    type: DataType.DATE,
  })
  estimated_delivery?: Date;

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

  @HasMany(() => OrderItem)
  items?: OrderItem[];

  @HasMany(() => Receipt)
  receipts?: Receipt[];

  @HasMany(() => Logistics)
  logistics?: Logistics[];

  @HasMany(() => Complaint)
  complaints?: Complaint[];
}
