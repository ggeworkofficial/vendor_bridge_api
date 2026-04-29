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

interface PaymentAccountAttributes {
  id: string;
  type: string;
  label: string;
  account_name: string;
  account_number: string;
  details?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface PaymentAccountCreationAttributes extends Optional<PaymentAccountAttributes, "details" | "created_at" | "updated_at"> {}

@Table({
  tableName: "payment_accounts",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class PaymentAccount extends Model<PaymentAccountAttributes, PaymentAccountCreationAttributes> implements PaymentAccountAttributes {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [["bank", "telebirr", "cbe_birr"]],
    },
  })
  type!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  label!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  account_name!: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(100),
  })
  account_number!: string;

  @Column({
    type: DataType.TEXT,
  })
  details?: string;

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
