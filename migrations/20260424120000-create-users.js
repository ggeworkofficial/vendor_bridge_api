"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "buyer",
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "active",
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

    await queryInterface.addConstraint("users", {
      fields: ["role"],
      type: "check",
      where: {
        role: ["buyer", "contributor", "admin"],
      },
      name: "users_role_check",
    });

    await queryInterface.addConstraint("users", {
      fields: ["status"],
      type: "check",
      where: {
        status: ["active", "suspended"],
      },
      name: "users_status_check",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("users");
  },
};
