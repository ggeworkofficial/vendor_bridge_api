'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex(
      'product_images',
      ['product_id'],
      {
        unique: true,
        where: {
          is_primary: true
        },
        name: 'unique_primary_product_image'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'product_images',
      'unique_primary_product_image'
    );
  }
};