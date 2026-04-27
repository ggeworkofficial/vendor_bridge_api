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
import User from "./user.model";
import ComplaintMessage from "./complaint-message.model";

@Table({
  tableName: "complaints",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class Complaint extends Model<Complaint> {
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
    type: DataType.UUID,
  })
  order_id?: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  subject!: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  description!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(30),
    validate: {
      isIn: [["open", "investigating", "resolved"]],
    },
  })
  status!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [["low", "medium", "high"]],
    },
  })
  priority!: string;

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

  @HasMany(() => ComplaintMessage)
  messages?: ComplaintMessage[];
}
