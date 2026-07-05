"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reseller_commissions", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },

      reseller_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "resellers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      reseller_click_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "reseller_clicks",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: "orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "inventory",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      sale_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      commission_rate: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      commission_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "unpaid",
      },

      paid_at: {
        type: Sequelize.DATE,
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

    await queryInterface.addConstraint("reseller_commissions", {
      fields: ["status"],
      type: "check",
      name: "reseller_commissions_status_check",
      where: {
        status: ["paid", "unpaid"],
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reseller_commissions");
  },
};