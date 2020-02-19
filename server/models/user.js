const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    roleId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 2,
    }
  }, {
    hooks: {
      beforeCreate(user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
      },

      beforeUpdate(user) {
        /* eslint-disable no-underscore-dangle*/
        if (user._changed.password) {
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
        }
      }
    }
  });

  User.associate = function (models) {
    // associations can be defined here
    this.belongsTo(models.Role, {
      foreignKey: 'roleId'
    });

    this.hasMany(models.Document, {
      foreignKey: 'authorId'
    });
  }

  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  }

  User.prototype.filterUserDetails = function () {
    const { password, createdAt, updatedAt, ...rest } = this.get();
    return rest;
  }

  User.prototype.filterUserList = function () {
    const { password, updatedAt, ...rest } = this.get();
    return rest;
  }

  return User;
};

