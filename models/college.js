// Dependencies
// =============================================================

// This may be confusing but here Sequelize (capital) references the standard library
var Sequelize = require("sequelize");
// sequelize (lowercase) references our connection to the DB.
var sequelize = require("../config/connection.js");

// Creates a "Chirp" model that matches up with DB
var College = sequelize.define("college", {
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  requirements: {
    type: Sequelize.STRING
  },
  tuition: {
    type: Sequelize.FLOAT
  },
  application_deadline: {
    type: Sequelize.STRING
  },
}, 
  
{
  timestamps: true
});

// Syncs with DB
College.sync();

// Makes the Chirp Model available for other files (will also create a table)
module.exports = College;
