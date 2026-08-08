import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import User from "./user.model";
import Inventory from "./inventory.model";

interface SellerAttributes {
  id: string;
  user_id?: string;
  name?: string;
  location?: string;
  contact?: string;
  verified?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface SellerCreationAttributes extends Optional<SellerAttributes, "name" | "location" | "contact" | "verified" | "created_at" | "updated_at"> {}

@Table({
  tableName: "sellers",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Seller extends Model<SellerAttributes, SellerCreationAttributes> implements SellerAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
  })
  user_id?: string;

  @BelongsTo(() => User)
  user?: User;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
  })
  name?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(255),
  })
  location?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(50),
  })
  contact?: string;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  verified!: boolean;

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

  @HasMany(() => Inventory)
  products?: Inventory[];
}
