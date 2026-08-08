'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX unique_pending_receipt_per_order
      ON receipts(order_id)
      WHERE status = 'pending_review';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS unique_pending_receipt_per_order;
    `);
  }
};