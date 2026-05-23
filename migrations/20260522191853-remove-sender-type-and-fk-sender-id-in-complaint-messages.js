'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Remove sender_type column
    await queryInterface.removeColumn(
      'complaint_messages',
      'sender_type'
    );

    // 2. Ensure sender_id is properly constrained to users table
    await queryInterface.changeColumn(
      'complaint_messages',
      'sender_id',
      {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // rollback: re-add sender_type
    await queryInterface.addColumn(
      'complaint_messages',
      'sender_type',
      {
        type: Sequelize.STRING(20),
        allowNull: false,
      }
    );

    // remove FK constraint on sender_id (revert to plain column)
    await queryInterface.changeColumn(
      'complaint_messages',
      'sender_id',
      {
        type: Sequelize.UUID,
        allowNull: true,
      }
    );
  },
};