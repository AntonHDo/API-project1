'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Spots';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots'
    await queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
        createdAt: "2021-11-19 20:39:36",
        updatedAt: "2021-11-19 20:39:36",
        avgRating: 4.5,
        previewImage: "image url"
      },
      {
        ownerId: 2,
        address: "3043 Pokemon Lane",
        city: "Santa Cruz",
        state: "Virgina",
        country: "United Kingdumb",
        lat: 40.4635358,
        lng: -99.5640327,
        name: "Ash Ketchup",
        description: "Gotta catch em all",
        price: 432,
        createdAt: "1994-02-14 20:39:36",
        updatedAt: "2234-12-02 20:39:36",
        avgRating: 1.5,
        previewImage: "image url"
      },
      {
        ownerId: 3,
        address: "351 McDonalds Road",
        city: "San Bruno",
        state: "New York",
        country: "United States of Asia",
        lat: 64.7635658,
        lng: -102.47354427,
        name: "Burger Queens",
        description: "Burgers are united",
        price: 2000,
        createdAt: "1990-12-1 20:39:36",
        updatedAt: "2001-11-19 20:39:36",
        avgRating: 0.5,
        previewImage: "image url"
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      state: { [Op.in]: ['California', 'Virgina', 'New York'] }
    }, {});
  }
};
