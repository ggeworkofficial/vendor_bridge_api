"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("cart_items", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      cart_id: {
        type: Sequelize.UUID,
        references: {
          model: "carts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      product_id: {
        type: Sequelize.UUID,
        references: {
          model: "inventory",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quantity: {
        type: Sequelize.INTEGER,
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
    });

    await queryInterface.addConstraint("cart_items", {
      fields: ["cart_id", "product_id"],
      type: "unique",
      name: "cart_items_cart_id_product_id_unique",
    });

    await queryInterface.addConstraint("cart_items", {
      fields: ["quantity"],
      type: "check",
      where: Sequelize.literal("quantity > 0"),
      name: "cart_items_quantity_check",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("cart_items");
  },
};
