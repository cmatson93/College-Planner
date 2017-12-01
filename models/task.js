module.exports = function(sequelize, DataTypes) {
var Task = sequelize.define("Task", {

  task: {
    type: DataTypes.STRING
  }
});

Task.associate = function(models) {
  Task.belongsTo(models.User, {
    foreignKey: {
      allowNull: false
    }
  });
};

return Task;
};
