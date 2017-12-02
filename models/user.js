module.exports = function(sequelize, DataTypes) {
var User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER
  },
  gpa: {
    type: DataTypes.FLOAT
  },
  location: {
    type: DataTypes.STRING
  }
});
return User;
};
