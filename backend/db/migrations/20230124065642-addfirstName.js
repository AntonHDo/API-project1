'use strict';
let options = {};
options.tableName = 'Users'; // define your table name in options object

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(options, 'firstname', { type: Sequelize.STRING });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn(options, 'firstname');
  }
};
