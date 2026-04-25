"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("logistics", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      order_id: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      carrier: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      tracking_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      origin: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      destination: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      estimated_eta: {
        type: Sequelize.DATE,
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

    await queryInterface.addConstraint("logistics", {
      fields: ["status"],
      type: "check",
      where: Sequelize.literal("status IN ('processing','in_transit','out_for_delivery','delivered')"),
      name: "logistics_status_check",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("logistics");
  },
};
