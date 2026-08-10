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
  HasOne,
  HasMany,
} from "sequelize-typescript";
import Seller from "./seller.model";
import Cart from "./cart.model";
import Order from "./order.model";
import Review from "./review.model";
import Complaint from "./complaint.model";
import UserRole from "./user-role.model";
import { Optional } from "sequelize";

interface UserAttributes {
  id: string;
  full_name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  ref_code: string;
  created_at: Date;
  updated_at: Date;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
     "role" | "status" | "created_at" | "updated_at" | "ref_code"
  > {}

@Table({
  tableName: "users",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  @PrimaryKey
  @AllowNull(false)
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
      isIn: [[
        "buyer", 
        "contributor", 
        "admin", 
        "reseller",
        "service_provider",
        "bulk_buyer",
        "seller",
      ]],
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

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(16),
  })
  ref_code!: string;

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

  @HasOne(() => Seller)
  seller?: Seller;

  @HasOne(() => Cart)
  cart?: Cart;

  @HasMany(() => Order)
  orders?: Order[];

  @HasMany(() => Review)
  reviews?: Review[];

  @HasMany(() => UserRole)
  userRoles?: UserRole[];
}
