"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the existing CHECK constraint
    await queryInterface.removeConstraint("users", "users_role_check");

    // Add the updated CHECK constraint
    await queryInterface.addConstraint("users", {
      fields: ["role"],
      type: "check",
      name: "users_role_check",
      where: {
        role: [
          "buyer",
          "contributor",
          "admin",
          "reseller",
          "service_provider",
          "bulk_buyer",
          "seller",
        ],
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the updated constraint
    await queryInterface.removeConstraint("users", "users_role_check");

    // Restore the original constraint
    await queryInterface.addConstraint("users", {
      fields: ["role"],
      type: "check",
      name: "users_role_check",
      where: {
        role: ["buyer", "contributor", "admin"],
      },
    });
  },
};