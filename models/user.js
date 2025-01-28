module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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

  User.associate = (models) => {
    User.hasMany(models.Blog, { foreignKey: 'userID' });
    User.hasMany(models.BlogRating, { foreignKey: 'userID' });
    User.hasMany(models.Comment, { foreignKey: 'userID' });
    User.hasMany(models.Like, { foreignKey: 'userID' });
  };

  return User;
};
