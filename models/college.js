module.exports = function(sequelize, DataTypes) {
var College = sequelize.define("College", {
  name: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  requirements: {
    type: DataTypes.STRING
  },
  tuition: {
    type: DataTypes.FLOAT
  },
  application_deadline: {
    type: DataTypes.STRING
  },
});

College.associate = function(models) {
  College.belongsTo(models.User, {
    foreignKey: {
      allowNull: false
    }
  });
};

return College;
};
