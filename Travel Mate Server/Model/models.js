const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db-config'); // Adjust the path to your db-config file

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING(500),
    defaultValue: null,
  },
  forgotPassword: {
    type: DataTypes.STRING(100),
    defaultValue: null,
  },
  created_at: {
    type: DataTypes.STRING(45),
    defaultValue: null,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Define the Review model
const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING(300),
    defaultValue: null,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  },
}, {
  tableName: 'reviews',
  timestamps: false,
});

// Define relationships
User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { User, Review };
