'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define(
    'Wiki',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false
      },
      private: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Wiki.associate = function(models) {
    // associations can be defined here
    Wiki.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Wiki.hasMany(models.Collaborator, {
      foreignKey: 'wikiId',
      as: 'collaborators'
    });
  };
  Wiki.addScope('wikisPublic', () => {
    return {
      where: { private: false },
      order: [['updatedAt', 'DESC']]
    };
  });
  Wiki.addScope('userWikisPublic', userId => {
    return {
      where: {
        userId: userId,
        private: false
      },
      order: [['createdAt', 'DESC']]
    };
  });
  return Wiki;
};
