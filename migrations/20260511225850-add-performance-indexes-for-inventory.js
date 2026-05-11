module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex("inventory", ["category_id"]);
    await queryInterface.addIndex("inventory", ["seller_id"]);
    await queryInterface.addIndex("inventory", ["quality_label"]);
    await queryInterface.addIndex("inventory", ["price"]);
    await queryInterface.addIndex("inventory", [
      { name: "created_at", order: "DESC" }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("inventory", ["category_id"]);
    await queryInterface.removeIndex("inventory", ["seller_id"]);
    await queryInterface.removeIndex("inventory", ["quality_label"]);
    await queryInterface.removeIndex("inventory", ["price"]);
    await queryInterface.removeIndex("inventory", ["created_at"]);
  }
};