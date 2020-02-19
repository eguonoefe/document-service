module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Roles', [{
      title: 'admin',
      description: 'total access',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'regularUser',
      description: 'partial access',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface) => {
    queryInterface.bulkDelete('Roles', null, {});
  }
};
