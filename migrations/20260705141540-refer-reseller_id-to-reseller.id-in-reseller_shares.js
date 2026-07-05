"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "reseller_shares",
      "reseller_shares_reseller_id_fkey"
    );

    await queryInterface.addConstraint("reseller_shares", {
      fields: ["reseller_id"],
      type: "foreign key",
      name: "reseller_shares_reseller_id_fkey",
      references: {
        table: "resellers",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "reseller_shares",
      "reseller_shares_reseller_id_fkey"
    );

    await queryInterface.addConstraint("reseller_shares", {
      fields: ["reseller_id"],
      type: "foreign key",
      name: "reseller_shares_reseller_id_fkey",
      references: {
        table: "users",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },
};