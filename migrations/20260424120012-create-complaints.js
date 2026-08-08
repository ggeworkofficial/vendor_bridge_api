"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("complaints", {
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
        onDelete: "CASCADE",
      },
      order_id: {
        type: Sequelize.UUID,
        references: {
          model: "orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      subject: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      priority: {
        type: Sequelize.STRING(20),
        allowNull: false,
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

    await queryInterface.addConstraint("complaints", {
      fields: ["status"],
      type: "check",
      where: Sequelize.literal("status IN ('open','investigating','resolved')"),
      name: "complaints_status_check",
    });

    await queryInterface.addConstraint("complaints", {
      fields: ["priority"],
      type: "check",
      where: Sequelize.literal("priority IN ('low','medium','high')"),
      name: "complaints_priority_check",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("complaints");
  },
};
