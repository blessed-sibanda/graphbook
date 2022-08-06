"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn("Posts", "userId", { type: Sequelize.INTEGER }),
      queryInterface.addConstraint("Posts", {
        fields: ["userId"],
        type: "foreign key",
        name: "fk_user_id",
        references: {
          table: "Users",
          field: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([queryInterface.removeColumn("Posts", "userId")]);
  },
};
