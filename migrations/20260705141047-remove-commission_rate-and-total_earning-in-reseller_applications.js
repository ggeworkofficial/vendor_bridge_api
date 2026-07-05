"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "reseller_applications",
      "commission_rate"
    );

    await queryInterface.removeColumn(
      "reseller_applications",
      "total_earnings"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "reseller_applications",
      "commission_rate",
      {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0,
      }
    );

    await queryInterface.addColumn(
      "reseller_applications",
      "total_earnings",
      {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      }
    );
  },
};