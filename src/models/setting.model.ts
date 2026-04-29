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
} from "sequelize-typescript";
import { Optional } from "sequelize";

interface SettingAttributes {
  id: string;
  key: string;
  value: object;
  description?: string;
  is_public?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface SettingCreationAttributes extends Optional<SettingAttributes, "description" | "is_public" | "created_at" | "updated_at"> {}

@Table({
  tableName: "settings",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Setting extends Model<SettingAttributes, SettingCreationAttributes> implements SettingAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(255),
  })
  key!: string;

  @AllowNull(false)
  @Column({
    type: DataType.JSONB,
  })
  value!: object;

  @Column({
    type: DataType.TEXT,
  })
  description?: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  is_public!: boolean;

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
}
