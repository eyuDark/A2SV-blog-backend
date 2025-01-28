module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
  });

  user.associate = (models) => {
    user.hasMany(models.Blog, { foreignKey: 'userID' });
    user.hasMany(models.BlogRating, { foreignKey: 'userID' });
    user.hasMany(models.Comment, { foreignKey: 'userID' });
    user.hasMany(models.Like, { foreignKey: 'userID' });
  };

  return user;
};
