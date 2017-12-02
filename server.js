
// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var db = require('./models');
var request = require('request');

const PORT = process.env.PORT || 3000;  // Port to listen to

var app = express();  // Get express handle

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

// Set Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up routes for the app
// var routes = require("./routes/college.js");
// app.use("/", routes);

require("./routes/college.js")(app);
// require("./routes/crud.js")(app);

//Start listening when connection to server is successful
db.sequelize.sync({force: true}).then(function() {
	app.listen(PORT, function(error) {
		if (error) throw error;
		console.log("Listening on port: " + PORT);
	});
});

var queryURL = "https://api.data.gov/ed/collegescorecard/v1/" + 
"schools.json?_zip=64075&_distance=100mi&api_key=TVS524kLUADDEEUcZl0PFHtEbVISmZCAGeT6buGi&_fields=school.name"; 


request(queryURL, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); 
});


