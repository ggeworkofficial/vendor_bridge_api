"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("reviews", {
      fields: ["product_id", "user_id"],
      type: "unique",
      name: "unique_user_product_review",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "reviews",
      "unique_user_product_review"
    );
  },
};