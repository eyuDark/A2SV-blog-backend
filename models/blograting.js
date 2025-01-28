module.exports = (sequelize, DataTypes) => {
  const BlogRating = sequelize.define('BlogRating', {
    ratingValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
  });

  BlogRating.associate = (models) => {
    BlogRating.belongsTo(models.user, { foreignKey: 'userID' });
    BlogRating.belongsTo(models.Blog, { foreignKey: 'blogID' });
  };

  return BlogRating;
};
