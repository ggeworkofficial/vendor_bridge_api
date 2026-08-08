"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("complaint_messages", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      complaint_id: {
        type: Sequelize.UUID,
        references: {
          model: "complaints",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      sender_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      sender_id: {
        type: Sequelize.UUID,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    await queryInterface.addConstraint("complaint_messages", {
      fields: ["sender_type"],
      type: "check",
      where: Sequelize.literal("sender_type IN ('user','admin')"),
      name: "complaint_messages_sender_type_check",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("complaint_messages");
  },
};
