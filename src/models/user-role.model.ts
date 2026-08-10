import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import User from "./user.model";
import Role from "./role.model";

interface UserRoleAttributes {
  id: string;
  user_id: string;
  role_id: string;
  created_at: Date;
  updated_at: Date;
}

interface UserRoleCreationAttributes
  extends Optional<UserRoleAttributes, "id" | "created_at" | "updated_at"> {}

@Table({
  tableName: "user_roles",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    {
      unique: true,
      fields: ["user_id", "role_id"],
    },
  ],
})
export default class UserRole extends Model<UserRoleAttributes, UserRoleCreationAttributes> implements UserRoleAttributes {
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

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  role_id!: string;

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

  @BelongsTo(() => Role)
  role?: Role;
}
