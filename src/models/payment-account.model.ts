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

@Table({
  tableName: "payment_accounts",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class PaymentAccount extends Model<PaymentAccount> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
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
