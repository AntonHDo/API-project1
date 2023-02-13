'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: "John",
        lastName: "Smith",
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: "Sean",
        lastName: "Jith",
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: "Rome",
        lastName: "Min",
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Derrick',
        lastName: 'Wang',
        email: 'theRick@gmail.com',
        username: 'Drick',
        hashedPassword: bcrypt.hashSync('password4')
      }, {
        firstName: 'Pen',
        lastName: 'Ny',
        email: 'penny@gmail.com',
        username: 'BigP',
        hashedPassword: bcrypt.hashSync('password5')
      }, {
        firstName: 'Anton',
        lastName: 'Do',
        email: 'anton@gmail.com',
        username: 'Anton',
        hashedPassword: bcrypt.hashSync('password6')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
