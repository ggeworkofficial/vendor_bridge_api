import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  Unique,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import RolePermission from "./role-permission.model";

interface PermissionAttributes {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

interface PermissionCreationAttributes
  extends Optional<PermissionAttributes, "description" | "created_at" | "updated_at"> {}

@Table({
  tableName: "permissions",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(255),
  })
  name!: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
  })
  description?: string;

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

  @HasMany(() => RolePermission)
  rolePermissions?: RolePermission[];
}
