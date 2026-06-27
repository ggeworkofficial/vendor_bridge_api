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
import User from "./user.model";
import Inventory from "./inventory.model";

interface ResellerShareAttributes {
  id: string;
  reseller_id: string;
  product_id: string;
  caption?: string;
  generated_link: string;
  total_clicks: number;
  total_conversions: number;
  created_at: Date;
  updated_at: Date;
}

interface ResellerShareCreationAttributes
  extends Optional<
    ResellerShareAttributes,
    | "caption"
    | "total_clicks"
    | "total_conversions"
    | "created_at"
    | "updated_at"
  > {}

@Table({
  tableName: "reseller_shares",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class ResellerShare
  extends Model<
    ResellerShareAttributes,
    ResellerShareCreationAttributes
  >
  implements ResellerShareAttributes
{
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  reseller_id!: string;

  @ForeignKey(() => Inventory)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  product_id!: string;

  @Column({
    type: DataType.TEXT,
  })
  caption?: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(500),
  })
  generated_link!: string;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  total_clicks!: number;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  total_conversions!: number;

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

  @BelongsTo(() => User)
  reseller?: User;

  @BelongsTo(() => Inventory)
  product?: Inventory;
}