const bcrypt = require('bcrypt');

module.exports = {
  up: function (queryInterface, Sequelize) {
    // return a new promise that sequelize will wait for...
    return new Promise((resolve, reject)=>{
            bcrypt.hash('superadmin', 10)
              .then(password => {
                queryInterface.bulkInsert('users', [{
                  name: 'Super Admin',
                  email: 'superadmin@example.com',
                  password: password,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }]);
                resolve('Done');
              })
              .catch((error) => {
                console.error(error);
                reject(error)
              });
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};