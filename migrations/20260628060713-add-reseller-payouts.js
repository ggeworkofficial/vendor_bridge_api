"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reseller_payouts", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },

      reseller_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "pending",
      },

      payment_method: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      payment_details: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      requested_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      processed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addConstraint("reseller_payouts", {
      fields: ["status"],
      type: "check",
      name: "reseller_payouts_status_check",
      where: {
        status: [
          "pending",
          "processing",
          "paid",
          "rejected",
        ],
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reseller_payouts");
  },
};