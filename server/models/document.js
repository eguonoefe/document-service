
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Title must be unique',
 
      },
      validate: {
        notEmpty: true
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    access: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'public',
      validate: {
        isIn: {
          args: [['public', 'private', 'role']],
          msg: 'Use a valid access type'
        }
      }
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, { });

  Document.associate = function (models) {
    // associations can be defined here
    this.belongsTo(models.User, {
      foreignKey: 'authorId'
    });

  }

  Document.prototype.filterDocumentDetails = function () {
    const { createdAt, updatedAt, ...rest } = this.get();
    return rest;
  }

  return Document;
};
