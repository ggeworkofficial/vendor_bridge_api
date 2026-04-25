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
import User from "./user.model";

@Table({
  tableName: "sellers",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Seller extends Model<Seller> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
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
}
