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
import ComplaintMessage from "./complaint-message.model";
import Order from "./order.model";

export type ComplaintStatus = 'open' | 'investigating' | 'resolved';
export type ComplaintPriority = 'low' | 'medium' | 'high';

interface ComplaintAttributes {
  id: string;
  order_id?: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  created_at?: Date;
  updated_at?: Date;
}

interface ComplaintCreationAttributes extends Optional<ComplaintAttributes, "created_at" | "updated_at"> {}

@Table({
  tableName: "complaints",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Complaint extends Model<ComplaintAttributes, ComplaintCreationAttributes> implements ComplaintAttributes {
  @PrimaryKey
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
    type: DataType.STRING(255),
  })
  subject!: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  description!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(30),
    validate: {
      isIn: [["open", "investigating", "resolved"]],
    },
  })
  status!: ComplaintStatus;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [["low", "medium", "high"]],
    },
  })
  priority!: ComplaintPriority;

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

  @HasMany(() => ComplaintMessage)
  messages?: ComplaintMessage[];
}
