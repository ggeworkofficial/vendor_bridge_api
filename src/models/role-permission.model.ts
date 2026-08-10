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
import Role from "./role.model";
import Permission from "./permission.model";

interface RolePermissionAttributes {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: Date;
  updated_at: Date;
}

interface RolePermissionCreationAttributes
  extends Optional<RolePermissionAttributes, "id" | "created_at" | "updated_at"> {}

@Table({
  tableName: "role_permissions",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    {
      unique: true,
      fields: ["role_id", "permission_id"],
    },
  ],
})
export default class RolePermission extends Model<RolePermissionAttributes, RolePermissionCreationAttributes> implements RolePermissionAttributes {
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  role_id!: string;

  @ForeignKey(() => Permission)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  permission_id!: string;

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

  @BelongsTo(() => Role)
  role?: Role;

  @BelongsTo(() => Permission)
  permission?: Permission;
}
