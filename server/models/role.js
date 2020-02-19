module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  }, { });

  Role.associate = function (models) {
    // associations can be defined here
    this.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'roles',
    });
  };

  return Role;
};
