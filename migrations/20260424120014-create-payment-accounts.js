"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("payment_accounts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      type: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      account_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      account_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      details: {
        type: Sequelize.TEXT,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    await queryInterface.addConstraint("payment_accounts", {
      fields: ["type"],
      type: "check",
      where: Sequelize.literal("type IN ('bank','telebirr','cbe_birr')"),
      name: "payment_accounts_type_check",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("payment_accounts");
  },
};
