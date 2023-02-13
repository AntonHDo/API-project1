'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [{
      spotId: 1,
      url: "https://mycleaningangel.com/wp-content/uploads/2020/11/airbnb-cleaning.jpg",
      preview: true
    },
    {
      spotId: 2,
      url: "https://a0.muscache.com/im/pictures/miso/Hosting-690516171990861652/original/c62c016f-4f44-4a20-bb16-2c888d81eb4e.jpeg?im_w=720",
      preview: true
    },
    {
      spotId: 3,
      url: "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_730,h_487/at%2Fhouse%20tours%2Farchive%2FKate%20Best%2Ffac74e4e9415e33447bfba2545b36309efb23910",
      preview: true
    },
    {
      spotId: 4,
      url: "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_730,h_487/at%2Fhouse%20tours%2Farchive%2FKate%20Best%2Ffac74e4e9415e33447bfba2545b36309efb23910",
      preview: true
    },
    {
      spotId: 5,
      url: "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_730,h_487/at%2Fhouse%20tours%2Farchive%2FKate%20Best%2Ffac74e4e9415e33447bfba2545b36309efb23910",
      preview: true
    },
    {
      spotId: 6,
      url: "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_730,h_487/at%2Fhouse%20tours%2Farchive%2FKate%20Best%2Ffac74e4e9415e33447bfba2545b36309efb23910",
      preview: true
    }
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
