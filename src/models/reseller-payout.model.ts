import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import Reseller from "./reseller.model";

interface ResellerPayoutAttributes {
  id: string;
  reseller_id: string;
  amount: number;
  status: string;
  payment_method: string;
  payment_details: string;
  requested_at: Date;
  processed_at?: Date;
  rejection_reason?: string;
  created_at: Date;
  updated_at: Date;
}

interface ResellerPayoutCreationAttributes
  extends Optional<
    ResellerPayoutAttributes,
    | "status"
    | "requested_at"
    | "processed_at"
    | "rejection_reason"
    | "created_at"
    | "updated_at"
  > {}

@Table({
  tableName: "reseller_payouts",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class ResellerPayout
  extends Model<
    ResellerPayoutAttributes,
    ResellerPayoutCreationAttributes
  >
  implements ResellerPayoutAttributes
{
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => Reseller)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  reseller_id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  amount!: number;

  @AllowNull(false)
  @Default("pending")
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [[
        "pending",
        "processing",
        "paid",
        "rejected",
      ]],
    },
  })
  status!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  payment_method!: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  payment_details!: string;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
  })
  requested_at!: Date;

  @Column({
    type: DataType.DATE,
  })
  processed_at?: Date;

  @Column({
    type: DataType.TEXT,
  })
  rejection_reason?: string;

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

  @BelongsTo(() => Reseller)
  reseller?: Reseller;
}