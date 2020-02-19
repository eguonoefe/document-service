const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'Eguono',
      lastName: 'Efekemo',
      email: 'efe@gmail.com',
      password: bcrypt.hashSync(
        process.env.HASH_PASSWORD, bcrypt.genSaltSync(8)),
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Efe',
      lastName: 'Eguono',
      email: 'eguono@gmail.com',
      password: bcrypt.hashSync(
        process.env.HASH_PASSWORD, bcrypt.genSaltSync(8)),
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface) => {
    queryInterface.bulkDelete('', null, {});
  }
};
