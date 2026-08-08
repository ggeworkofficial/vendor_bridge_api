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
import { Optional } from "sequelize";
import Complaint from "./complaint.model";
import User from "./user.model";

interface ComplaintMessageAttributes {
  id: string;
  complaint_id?: string;
  sender_id: string;
  message: string;
  created_at?: Date;
}

interface ComplaintMessageCreationAttributes extends Optional<ComplaintMessageAttributes, "created_at"> {}

@Table({
  tableName: "complaint_messages",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: false,
})
export default class ComplaintMessage extends Model<ComplaintMessageAttributes, ComplaintMessageCreationAttributes> implements ComplaintMessageAttributes {
  @PrimaryKey
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

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  sender_id!: string;

  @BelongsTo(() => User)
  user!: User;

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
