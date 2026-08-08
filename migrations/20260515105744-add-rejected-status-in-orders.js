'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // Remove old constraint
    await queryInterface.removeConstraint(
      "orders",
      "orders_status_check"
    );

    // Add new constraint with rejected
    await queryInterface.addConstraint("orders", {
      fields: ["status"],
      type: "check",
      where: Sequelize.literal(
        "status IN ('pending','confirmed','out_for_delivery','delivered','cancelled','rejected')"
      ),
      name: "orders_status_check",
    });
  },

  async down(queryInterface, Sequelize) {

    // Remove updated constraint
    await queryInterface.removeConstraint(
      "orders",
      "orders_status_check"
    );

    // Restore original constraint
    await queryInterface.addConstraint("orders", {
      fields: ["status"],
      type: "check",
      where: Sequelize.literal(
        "status IN ('pending','confirmed','out_for_delivery','delivered','cancelled')"
      ),
      name: "orders_status_check",
    });
  }
};