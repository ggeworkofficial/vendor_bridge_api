"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("seller_applications", {
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

      business_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      business_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

      tax_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      business_license: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      region: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      product_categories: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },

      social_media: {
        type: Sequelize.JSON,
        allowNull: true,
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

    await queryInterface.addConstraint("seller_applications", {
      fields: ["business_type"],
      type: "check",
      name: "seller_applications_business_type_check",
      where: {
        business_type: ["individual", "company", "cooperative"],
      },
    });

    await queryInterface.addConstraint("seller_applications", {
      fields: ["status"],
      type: "check",
      name: "seller_applications_status_check",
      where: {
        status: ["pending", "approved", "rejected"],
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("seller_applications");
  },
};