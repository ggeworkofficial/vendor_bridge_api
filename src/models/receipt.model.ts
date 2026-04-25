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
import Order from "./order.model";

@Table({
  tableName: "receipts",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Receipt extends Model<Receipt> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => Order)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
  })
  order_id?: string;

  @BelongsTo(() => Order)
  order?: Order;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  amount!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [["full", "advance", "cod"]],
    },
  })
  payment_method!: string;

  @Column({
    type: DataType.STRING(255),
  })
  account?: string;

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
  status!: string;

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
