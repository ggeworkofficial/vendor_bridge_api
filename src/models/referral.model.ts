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
import Listing from "./listing.model";
import Order from "./order.model";

export type ReferralStatus = 'pending' | 'cleared' | 'paid' | 'void';

export interface ReferralAttributes {
  id: string;
  reseller_id: string;
  listing_id: string;
  order_id?: string;
  order_total: number;
  commission_percent: number;
  commission_amount: number;
  status: ReferralStatus;
  created_at?: Date;
  updated_at?: Date;
}

interface ReferralCreationAttributes extends Optional<ReferralAttributes, "status" | "created_at" | "updated_at"> {}

@Table({
  tableName: "referrals",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Referral extends Model<ReferralAttributes, ReferralCreationAttributes> implements ReferralAttributes {
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
  reseller_id!: string;

  @BelongsTo(() => User)
  reseller?: User;

  @ForeignKey(() => Listing)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  listing_id!: string;

  @BelongsTo(() => Listing)
  listing?: Listing;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUID,
  })
  order_id?: string;

  @BelongsTo(() => Order)
  order?: Order;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
  })
  order_total!: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(5, 2),
  })
  commission_percent!: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
  })
  commission_amount!: number;

  @Default('pending')
  @Column({
    type: DataType.ENUM('pending', 'cleared', 'paid', 'void'),
  })
  status!: ReferralStatus;

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
