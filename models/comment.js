module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.user, { foreignKey: 'userID' });
    Comment.belongsTo(models.Blog, { foreignKey: 'blogID' });
  };

  return Comment;
};
