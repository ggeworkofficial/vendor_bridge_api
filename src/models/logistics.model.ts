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
  Unique,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import Order from "./order.model";

export type LogisticsStatus =
  | 'processing'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered';
interface LogisticsAttributes {
  id: string;
  order_id: string;
  carrier: string;
  tracking_number: string;
  status: LogisticsStatus;
  origin: string;
  destination: string;
  estimated_eta?: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface LogisticsCreationAttributes extends Optional<LogisticsAttributes, "estimated_eta" | "created_at" | "updated_at"> {}

@Table({
  tableName: "logistics",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Logistics extends Model<LogisticsAttributes, LogisticsCreationAttributes> implements LogisticsAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => Order)
  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  order_id!: string;

  @BelongsTo(() => Order)
  order!: Order;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  carrier!: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(100),
  })
  tracking_number!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(30),
    validate: {
      isIn: [["processing", "in_transit", "out_for_delivery", "delivered"]],
    },
  })
  status!: LogisticsStatus;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  origin!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  destination!: string;

  @Column({
    type: DataType.DATE,
  })
  estimated_eta?: Date;

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
