"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("orders", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      estimated_delivery: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("orders", {
      fields: ["status"],
      type: "check",
      where: Sequelize.literal("status IN ('pending','confirmed','out_for_delivery','delivered','cancelled')"),
      name: "orders_status_check",
    });

    await queryInterface.addConstraint("orders", {
      fields: ["payment_status"],
      type: "check",
      where: Sequelize.literal("payment_status IN ('paid','unpaid')"),
      name: "orders_payment_status_check",
    });

    await queryInterface.addConstraint("orders", {
      fields: ["payment_method"],
      type: "check",
      where: Sequelize.literal("payment_method IN ('full','advance','cod')"),
      name: "orders_payment_method_check",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("orders");
  },
};
