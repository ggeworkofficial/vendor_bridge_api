'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex(
      "reviews",
      ["product_id", "created_at"],
      {
        name: "idx_reviews_product_created"
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "reviews",
      "idx_reviews_product_created"
    );
  }
};
