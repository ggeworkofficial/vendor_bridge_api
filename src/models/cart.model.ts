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
  Unique,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import User from "./user.model";
import CartItem from "./cart-item.model";

interface CartAttributes {
  id: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
}

interface CartCreationAttributes extends Optional<CartAttributes, "created_at" | "updated_at"> {}

@Table({
  tableName: "carts",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.UUID,
  })
  user_id!: string;

  @BelongsTo(() => User)
  user!: User;

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

  @HasMany(() => CartItem)
  items?: CartItem[];
}
    

