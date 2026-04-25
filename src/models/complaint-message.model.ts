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
} from "sequelize-typescript";
import Complaint from "./complaint.model";

@Table({
  tableName: "complaint_messages",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: false,
})
export default class ComplaintMessage extends Model<ComplaintMessage> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @ForeignKey(() => Complaint)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
  })
  complaint_id?: string;

  @BelongsTo(() => Complaint)
  complaint?: Complaint;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [["user", "admin"]],
    },
  })
  sender_type!: string;

  @Column({
    type: DataType.UUID,
  })
  sender_id?: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  message!: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;
}
