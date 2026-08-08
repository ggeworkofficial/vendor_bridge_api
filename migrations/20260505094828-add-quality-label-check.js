'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("inventory", {
      fields: ["quality_label"],
      type: "check",
      where: {
        quality_label: ["high", "medium", "low"],
      },
      name: "quality_label_check",
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("inventory", "quality_lable_check");
  }
};
