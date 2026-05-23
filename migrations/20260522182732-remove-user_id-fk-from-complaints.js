'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'complaints',
      'complaints_user_id_fkey'
    );

    await queryInterface.removeColumn(
      'complaints',
      'user_id'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'complaints',
      'user_id',
      {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    );
  }
};