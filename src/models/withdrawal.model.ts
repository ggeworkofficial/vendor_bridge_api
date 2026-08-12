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
import User from "./user.model";

export type WithdrawalMethod = 'bank' | 'telebirr' | 'cbe_birr';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export interface WithdrawalAttributes {
  id: string;
  user_id: string;
  amount: number;
  method: WithdrawalMethod;
  account_name: string;
  account_number: string;
  note?: string;
  status: WithdrawalStatus;
  processed_by?: string;
  processed_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface WithdrawalCreationAttributes extends Optional<WithdrawalAttributes, "status" | "created_at" | "updated_at"> {}

@Table({
  tableName: "withdrawals",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Withdrawal extends Model<WithdrawalAttributes, WithdrawalCreationAttributes> implements WithdrawalAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  user_id!: string;

  @BelongsTo(() => User, 'user_id')
  user?: User;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
  })
  amount!: number;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM('bank', 'telebirr', 'cbe_birr'),
  })
  method!: WithdrawalMethod;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  account_name!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  account_number!: string;

  @Column({
    type: DataType.TEXT,
  })
  note?: string;

  @Default('pending')
  @Column({
    type: DataType.ENUM('pending', 'approved', 'rejected', 'paid'),
  })
  status!: WithdrawalStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  processed_by?: string;

  @BelongsTo(() => User, 'processed_by')
  processor?: User;

  @Column({
    type: DataType.DATE,
  })
  processed_at?: Date;

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
