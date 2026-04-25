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
  tableName: "users",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  id!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  full_name!: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(255),
  })
  email!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  password!: string;

  @AllowNull(false)
  @Default("buyer")
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [["buyer", "contributor", "admin"]],
    },
  })
  role!: string;

  @AllowNull(false)
  @Default("active")
  @Column({
    type: DataType.STRING(20),
    validate: {
      isIn: [["active", "suspended"]],
    },
  })
  status!: string;

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
