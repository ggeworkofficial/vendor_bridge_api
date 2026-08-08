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

interface SellerApplicationAttributes {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  tax_id?: string;
  business_license?: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  description: string;
  product_categories: string[];
  social_media?: object;
  status: string;
  rejection_reason?: string;
  admin_notes?: string;
  created_at: Date;
  updated_at: Date;
}

interface SellerApplicationCreationAttributes
  extends Optional<
    SellerApplicationAttributes,
    | "tax_id"
    | "business_license"
    | "social_media"
    | "status"
    | "rejection_reason"
    | "admin_notes"
    | "created_at"
    | "updated_at"
  > {}

@Table({
  tableName: "seller_applications",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class SellerApplication
  extends Model<
    SellerApplicationAttributes,
    SellerApplicationCreationAttributes
  >
  implements SellerApplicationAttributes
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
    type: DataType.STRING(255),
  })
  business_name!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [["individual", "company", "cooperative"]],
    },
  })
  business_type!: string;

  @Column({
    type: DataType.STRING(100),
  })
  tax_id?: string;

  @Column({
    type: DataType.STRING(100),
  })
  business_license?: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
  })
  phone!: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  address!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  city!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  region!: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  description!: string;

  @AllowNull(false)
  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  product_categories!: string[];

  @Column({
    type: DataType.JSON,
  })
  social_media?: object;

  @AllowNull(false)
  @Default("pending")
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [["pending", "approved", "rejected"]],
    },
  })
  status!: string;

  @Column({
    type: DataType.TEXT,
  })
  rejection_reason?: string;

  @Column({
    type: DataType.TEXT,
  })
  admin_notes?: string;

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