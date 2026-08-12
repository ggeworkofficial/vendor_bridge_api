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
import Seller from "./seller.model";

export interface FollowAttributes {
  id: string;
  follower_id: string;
  seller_id: string;
  created_at?: Date;
  updated_at?: Date;
}

interface FollowCreationAttributes extends Optional<FollowAttributes, "created_at" | "updated_at"> {}

@Table({
  tableName: "follows",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    {
      name: "unique_follow_pair",
      unique: true,
      fields: ["follower_id", "seller_id"],
    },
  ],
})
export default class Follow extends Model<FollowAttributes, FollowCreationAttributes> implements FollowAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  follower_id!: string;

  @BelongsTo(() => User)
  follower?: User;

  @ForeignKey(() => Seller)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  seller_id!: string;

  @BelongsTo(() => Seller)
  seller?: Seller;

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
