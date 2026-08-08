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
import * as Order from "./order.model";

export type ReceiptStatus = 'pending_review' | 'approved' | 'rejected';
interface ReceiptAttributes {
  id: string;
  order_id?: string;
  amount: number;
  payment_method: Order.PaymentMethod;
  account?: string;
  file_url: string;
  status: ReceiptStatus;
  note?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface ReceiptCreationAttributes extends Optional<ReceiptAttributes, "note" | "created_at" | "updated_at"> {}

@Table({
  tableName: "receipts",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Receipt extends Model<ReceiptAttributes, ReceiptCreationAttributes> implements ReceiptAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => Order.default)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
  })
  order_id?: string;

  @BelongsTo(() => Order.default)
  order?: Order.default;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  amount!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [["full", "advance", "cod"]],
    },
  })
  payment_method!: Order.PaymentMethod;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  account!: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  file_url!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(30),
    validate: {
      isIn: [["pending_review", "approved", "rejected"]],
    },
  })
  status!: ReceiptStatus;

  @Column({
    type: DataType.TEXT,
  })
  note?: string;

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
