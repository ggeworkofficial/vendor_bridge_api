"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("receipts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      order_id: {
        type: Sequelize.UUID,
        references: {
          model: "orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      account: {
        type: Sequelize.STRING(255),
      },
      file_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      note: {
        type: Sequelize.TEXT,
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
    });

    await queryInterface.addConstraint("receipts", {
      fields: ["payment_method"],
      type: "check",
      where: Sequelize.literal("payment_method IN ('full','advance','cod')"),
      name: "receipts_payment_method_check",
    });

    await queryInterface.addConstraint("receipts", {
        fields: ["status"],
        type: "check",
        where: Sequelize.literal("status IN ('pending_review','approved','rejected')"),
        name: "receipts_status_check",
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("receipts");
  },
};
