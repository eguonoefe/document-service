module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      content: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      access: {
        allowNull: false,
        type: Sequelize.STRING
      },
      roleId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      authorId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'cascade',
      }
    });
  },
  down: (queryInterface /* , Sequelize*/) => {
    return queryInterface.dropTable('Documents');
  }
};
