'use strict';

const faker = require('faker');

let wikis = [];
for (let i = 1; i <= 60; i++) {
	wikis.push({
		title: faker.lorem.sentence(),
		body: faker.lorem.sentence(),
		private: faker.random.boolean(),
		userId: 1,
		createdAt: new Date(),
		updatedAt: new Date(),
	});
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Wikis', wikis, {});
  },

  down: (queryInterface, Sequelize) => {
return queryInterface.bulkDelete('Wikis', wikis, {});
  }
};
