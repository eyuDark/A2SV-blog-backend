module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  Blog.associate = (models) => {
    Blog.belongsTo(models.user, { foreignKey: 'userID' });
    Blog.hasMany(models.BlogRating, { foreignKey: 'blogID' });
    Blog.hasMany(models.Comment, { foreignKey: 'blogID' });
    Blog.hasMany(models.Like, { foreignKey: 'blogID' });
  };

  return Blog;
};
