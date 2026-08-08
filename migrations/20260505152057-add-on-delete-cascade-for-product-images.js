"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Remove existing constraint
    await queryInterface.removeConstraint(
      "product_images",
      "product_images_product_id_fkey"
    );

    // 2. Add new constraint with CASCADE
    await queryInterface.addConstraint("product_images", {
      fields: ["product_id"],
      type: "foreign key",
      name: "product_images_product_id_fkey", // reuse same name (optional but clean)
      references: {
        table: "inventory",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // 🔥 changed here
    });
  },

  async down(queryInterface, Sequelize) {
    // rollback: revert back to SET NULL

    await queryInterface.removeConstraint(
      "product_images",
      "product_images_product_id_fkey"
    );

    await queryInterface.addConstraint("product_images", {
      fields: ["product_id"],
      type: "foreign key",
      name: "product_images_product_id_fkey",
      references: {
        table: "inventory",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // revert
    });
  },
};