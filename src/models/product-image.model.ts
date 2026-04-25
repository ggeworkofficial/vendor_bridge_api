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

@Table({
  tableName: "product_images",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class ProductImage extends Model<ProductImage> {
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

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  image_url!: string;

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
