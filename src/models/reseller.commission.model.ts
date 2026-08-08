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
import ResellerClick from "./reseller-click.model";
import Order from "./order.model";
import Inventory from "./inventory.model";

interface ResellerCommissionAttributes {
  id: string;
  reseller_id: string;
  reseller_click_id: string;
  order_id: string;
  product_id: string;
  sale_price: number;
  commission_rate: number;
  commission_amount: number;
  status: string;
  paid_at?: Date;
  created_at: Date;
  updated_at: Date;
}

interface ResellerCommissionCreationAttributes
  extends Optional<
    ResellerCommissionAttributes,
    | "sale_price"
    | "status"
    | "paid_at"
    | "created_at"
    | "updated_at"
  > {}

@Table({
  tableName: "reseller_commissions",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class ResellerCommission
  extends Model<
    ResellerCommissionAttributes,
    ResellerCommissionCreationAttributes
  >
  implements ResellerCommissionAttributes
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

  @ForeignKey(() => ResellerClick)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  reseller_click_id!: string;

  @ForeignKey(() => Order)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  order_id!: string;

  @ForeignKey(() => Inventory)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  product_id!: string;

  @AllowNull(false)
  @Default(1)
  @Column({
    type: DataType.INTEGER,
  })
  sale_price!: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  commission_rate!: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  commission_amount!: number;

  @AllowNull(false)
  @Default("unpaid")
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [["paid", "unpaid"]],
    },
  })
  status!: string;

  @Column({
    type: DataType.DATE,
  })
  paid_at?: Date;

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

  @BelongsTo(() => ResellerClick)
  resellerClick?: ResellerClick;

  @BelongsTo(() => Order)
  order?: Order;

  @BelongsTo(() => Inventory)
  product?: Inventory;
}