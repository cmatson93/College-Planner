// Dependencies
// =============================================================

// This may be confusing but here Sequelize (capital) references the standard library
var Sequelize = require("sequelize");
// sequelize (lowercase) references our connection to the DB.
var sequelize = require("../config/connection.js");

// Creates a "Chirp" model that matches up with DB
var Task = sequelize.define("task", {
 
  task: {
    type: Sequelize.STRING
  }
});

Post.associate = function(models) {
  Post.belongsTo(models.User, {
    foreignKey: {
      allowNull: false
    }
  });
};

// Syncs with DB
Task.sync();

// Makes the Chirp Model available for other files (will also create a table)
module.exports = Task;
