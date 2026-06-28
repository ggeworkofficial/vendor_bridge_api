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
import ResellerShare from "./reseller-share.model";

interface ResellerClickAttributes {
  id: string;
  reseller_share_id: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  converted: boolean;
  created_at: Date;
  updated_at: Date;
}

interface ResellerClickCreationAttributes
  extends Optional<
    ResellerClickAttributes,
    | "ip_address"
    | "user_agent"
    | "referrer"
    | "converted"
    | "created_at"
    | "updated_at"
  > {}

@Table({
  tableName: "reseller_clicks",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class ResellerClick
  extends Model<
    ResellerClickAttributes,
    ResellerClickCreationAttributes
  >
  implements ResellerClickAttributes
{
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => ResellerShare)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  reseller_share_id!: string;

  @Column({
    type: DataType.STRING(45),
  })
  ip_address?: string;

  @Column({
    type: DataType.TEXT,
  })
  user_agent?: string;

  @Column({
    type: DataType.TEXT,
  })
  referrer?: string;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  converted!: boolean;

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

  @BelongsTo(() => ResellerShare)
  resellerShare?: ResellerShare;
}