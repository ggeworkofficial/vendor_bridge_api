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
} from "sequelize-typescript";
import Inventory from "./inventory.model";
import User from "./user.model";

@Table({
  tableName: "reviews",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Review extends Model<Review> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => Inventory)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
  })
  product_id?: string;

  @BelongsTo(() => Inventory)
  product?: Inventory;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
  })
  user_id?: string;

  @BelongsTo(() => User)
  user?: User;

  @AllowNull(false)
  @Column({
    type: DataType.SMALLINT,
    validate: {
      min: 1,
      max: 5,
    },
  })
  rating!: number;

  @Column({
    type: DataType.TEXT,
  })
  comment?: string;

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
