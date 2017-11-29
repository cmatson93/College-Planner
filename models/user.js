// Dependencies
// =============================================================

// This may be confusing but here Sequelize (capital) references the standard library
var Sequelize = require("sequelize");
// sequelize (lowercase) references our connection to the DB.
var sequelize = require("../config/connection.js");

// Creates a "Chirp" model that matches up with DB
var User = sequelize.define("user", {
  name: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  score: {
    type: Sequelize.INTEGER
  },
  gpa: {
    type: Sequelize.FLOAT
  },
  location: {
    type: Sequelize.STRING
  }
}, 
  
{
  timestamps: true
});

// Syncs with DB
User.sync();

// Makes the Chirp Model available for other files (will also create a table)
module.exports = User;
