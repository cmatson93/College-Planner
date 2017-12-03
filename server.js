
// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var db = require('./models');
var request = require('request');

var passport   = require('passport')
var session    = require('express-session')
var bodyParser = require('body-parser')
var env        = require('dotenv').load()


const PORT = process.env.PORT || 3000;  // Port to listen to

var app = express();  // Get express handle

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

// For Passport
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Set Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up routes for the app
// var routes = require("./routes/college.js");
// app.use("/", routes);

require("./routes/college.js")(app,passport);


//load passport strategies
require('./config/passport/passport.js')(passport,db.User);


// require("./routes/crud.js")(app);

//Start listening when connection to server is successful
db.sequelize.sync().then(function() {
	app.listen(PORT, function(error) {
		if (error) throw error;
		console.log("Listening on port: " + PORT);
	});
});
