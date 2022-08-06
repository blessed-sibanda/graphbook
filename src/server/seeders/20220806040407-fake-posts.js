"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    return queryInterface.sequelize
      .query("SELECT id from Users;")
      .then((users) => {
        const userRows = users[0];
        return queryInterface.bulkInsert(
          "Posts",
          [
            {
              text: "Lorem ipsum 1",
              userId: userRows[0].id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              text: "Lorem ipsum 2",
              userId: userRows[1].id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          {}
        );
      });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Posts", null, {});
  },
};
