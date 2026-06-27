"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reseller_applications", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      full_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

      social_media_accounts: {
        type: Sequelize.JSON,
        allowNull: false,
      },

      marketing_experience: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      preferred_categories: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "pending",
      },

      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      admin_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      commission_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0,
      },

      total_earnings: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
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

    await queryInterface.addConstraint("reseller_applications", {
      fields: ["status"],
      type: "check",
      name: "reseller_applications_status_check",
      where: {
        status: [
          "pending",
          "approved",
          "rejected",
          "suspended",
        ],
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reseller_applications");
  },
};