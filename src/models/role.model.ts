import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import UserRole from "./user-role.model";
import RolePermission from "./role-permission.model";

interface RoleAttributes {
  id: string;
  name: string;
  description?: string;
  is_system: boolean;
  created_at: Date;
  updated_at: Date;
}

interface RoleCreationAttributes
  extends Optional<RoleAttributes, "description" | "is_system" | "created_at" | "updated_at"> {}

@Table({
  tableName: "roles",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(225),
  })
  name!: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
  })
  description?: string;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  is_system!: boolean;

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

  @HasMany(() => UserRole)
  userRoles?: UserRole[];

  @HasMany(() => RolePermission)
  rolePermissions?: RolePermission[];
}
