module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {});

  Like.associate = (models) => {
    Like.belongsTo(models.user, { foreignKey: 'userID' });
    Like.belongsTo(models.Blog, { foreignKey: 'blogID' });
  };

  return Like;
};
