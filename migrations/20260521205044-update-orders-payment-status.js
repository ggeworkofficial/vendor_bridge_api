'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Drop old constraint
    await queryInterface.removeConstraint(
      'orders',
      'orders_payment_status_check'
    );

    // 2. Add new expanded constraint
    await queryInterface.addConstraint('orders', {
      fields: ['payment_status'],
      type: 'check',
      name: 'orders_payment_status_check',
      where: {
        payment_status: ['paid', 'unpaid', 'pending_review', 'rejected']
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // rollback to old state
    await queryInterface.removeConstraint(
      'orders',
      'orders_payment_status_check'
    );

    await queryInterface.addConstraint('orders', {
      fields: ['payment_status'],
      type: 'check',
      name: 'orders_payment_status_check',
      where: {
        payment_status: ['paid', 'unpaid']
      }
    });
  }
};