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

export interface SocialMediaAccount {
  platform: string;
  username: string;
  url: string;
}

interface ResellerApplicationAttributes {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  social_media_accounts: SocialMediaAccount[];
  marketing_experience: string;
  preferred_categories: string[];
  status: string;
  rejection_reason?: string;
  admin_notes?: string;
  created_at: Date;
  updated_at: Date;
}

interface ResellerApplicationCreationAttributes
  extends Optional<
    ResellerApplicationAttributes,
    | "status"
    | "rejection_reason"
    | "admin_notes"
    | "created_at"
    | "updated_at"
  > {}

@Table({
  tableName: "reseller_applications",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class ResellerApplication
  extends Model<
    ResellerApplicationAttributes,
    ResellerApplicationCreationAttributes
  >
  implements ResellerApplicationAttributes
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
  full_name!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  email!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
  })
  phone!: string;

  @AllowNull(false)
  @Column({
    type: DataType.JSON,
  })
  social_media_accounts!: SocialMediaAccount[];

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  marketing_experience!: string;

  @AllowNull(false)
  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  preferred_categories!: string[];

  @AllowNull(false)
  @Default("pending")
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [[
        "pending",
        "approved",
        "rejected",
        "suspended",
      ]],
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