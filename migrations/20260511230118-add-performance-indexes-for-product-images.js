'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex("product_images", [
      "product_id",
      "is_primary",
      "created_at"
    ], {
      name: "idx_product_images_product_primary_created"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "product_images",
      "idx_product_images_product_primary_created"
    );
  }
};