// src/config/database.ts
import { Sequelize } from "sequelize-typescript";
import { Category, PaymentAccount, Setting, User, Seller, Cart, Complaint, Inventory, ProductImage, Review, CartItem, Order, OrderItem } from "../models";

class Postgres {
  private static instance: Sequelize;

  private constructor() {}

  public static getInstance(): Sequelize {
    if (!Postgres.instance) {
      Postgres.instance = new Sequelize({
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT)!,
        database: process.env.DB_NAME!,
        username: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        dialect: "postgres",
        logging: false,
        models: [User, Category, PaymentAccount, Setting, Seller, Cart, Complaint, Inventory, ProductImage, Review, CartItem, Order, OrderItem],
      });
    }

    return Postgres.instance;
  }

  public static get sequelize(): Sequelize {
    return Postgres.getInstance();
  }

  public static async connect() {
    const sequelize = Postgres.getInstance();

    try {
      await sequelize.authenticate();
      console.log("Database connected successfully");
    } catch (error) {
      throw error;
    }
  }
}

export default Postgres;