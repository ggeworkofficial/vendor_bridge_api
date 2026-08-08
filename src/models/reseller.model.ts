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

interface ResellerAttributes {
  id: string;
  user_id: string;
  commission_rate: number;
  joined_at: Date;
  is_active: boolean;
  current_balance: number;
  total_paid: number;
  created_at: Date;
  updated_at: Date;
}

interface ResellerCreationAttributes
  extends Optional<
    ResellerAttributes,
    | "joined_at"
    | "is_active"
    | "current_balance"
    | "total_paid"
    | "created_at"
    | "updated_at"
  > {}

@Table({
  tableName: "resellers",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Reseller
  extends Model<ResellerAttributes, ResellerCreationAttributes>
  implements ResellerAttributes
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
  user_id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  commission_rate!: number;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
  })
  joined_at!: Date;

  @AllowNull(false)
  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  is_active!: boolean;

  @AllowNull(false)
  @Default(0.0)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  current_balance!: number;

  @AllowNull(false)
  @Default(0.0)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  total_paid!: number;

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
  user?: User;
}