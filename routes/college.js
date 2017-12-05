/*
 * Contains all routes on the Server side.
 */

// Dependencies
var authController = require('../controllers/authcontroller.js');
var db = require("../models");
var request = require('request');
const util = require('util')

// Globals
var userObj;
var userId = 0;
var tasks = [];

// Define and export all routes to server.js
module.exports =  function(app, passport){

	// Home page
	app.get("/", function(req, res) {
		res.render('index');
	});

	app.get('/signup', authController.signup);


	app.get('/signin', authController.signin);


	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup'
	}));

	app.get('/logout', authController.logout);


	app.post('/signin', passport.authenticate('local-signin', {
		successRedirect: '/profile',
		failureRedirect: '/signin'
}));

	// Get Contact page
	app.get("/contact", function(req, res) {
		res.render('contact');
	});

	// Get Testimonials page
	app.get("/testimonials", function(req, res) {
		res.render('testimonials');
	});

	//  Get Update profile page
	app.get("/update-profile", function(req, res){
		res.render('update', userObj);
	});

	// Post from the Profile Update form
	app.post("/update-profile", function(req, res) {

		// Let us save the latest information from the form
		if (req.body.location) {
			userObj["location"] = req.body.location;
		}

		if (req.body.gpa) {
			userObj["gpa"] = req.body.gpa;
		}

		if (req.body.score) {
			userObj["score"] = req.body.score;
		}



		// Update user data: Score, GPA and Location
		// For now we are restricting the user from updating the name, email and password once it is created
		// Can easily be enhanced in the future
		db.User.update(
		{
			score: userObj.score,
			gpa: userObj.gpa,
			location: userObj.location,
		},
		{
			where: {
		    	id: userObj.id
		  	}
		})
		.then(function(result) {
			// Build the college data with updated user profileto pass it to user.handlebars
	    	renderUserCollege(userObj, res);
		});
	});

	// Post from the Sign In or Registrtion Form
	app.get("/profile",isLoggedIn, function(req, res) {


			    	userId = req.user.id;
						userObj = {
						id: req.user.id,
						name: req.user.name,
				  		email: req.user.email,
				  		location: req.user.location,
				  		gpa: req.user.gpa,
				  		score: req.user.score,
				  		college: [],
				  		todoList: []
					};
					getTask(userObj,res);

	});

	// Todo Processing
	app.post("/todo", function(req, res) {
		var task = toTitleCase(req.body.task);
		db.Task.create({
	        task: task,
	        UserId: userId
	      }).then(function(result) {
	      	getTask(userObj,res);
	      });
	});

	function getTask(userObj,res){
		db.Task.findAll({
			// include: [db.User],
			where: {
					UserId: userId
			}
		})
		.then(function(result) {

			// Built the college data object to pass it to user.handlebars
			var tasks = [];
			for (var i=0; i< result.length; i++) {
				var taskObj = {task: result[i].task};
				tasks.push(taskObj);
			}
			userObj.todoList = tasks;

	renderUserCollege(userObj, res);
		});
	}

	function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();

    res.redirect('/signin');
  }

};

// Function to render College Data for a given location
function renderUserCollege(data, res){

	var location = data.location;

	if (location != null) {
		var api_key = "TVS524kLUADDEEUcZl0PFHtEbVISmZCAGeT6buGi";
		var results = "&_fields=school.name,school.school_url,school.city,school.state";
		var query = "https://api.data.gov/ed/collegescorecard/v1/schools.json?_zip="+location+"&_distance=100mi&api_key="+ api_key + results;

		// API to get College Data
		request(query, function (error, response, body) {
		  	// Display only top 5 colleges
		 	var length = 5;
			if (JSON.parse(body).results.length < 5) {
		  		length = JSON.parse(body).results.length;
		  	}
		  	var collegeResults = JSON.parse(body).results;
		  	var collegeArr = [];
		 	for (var i=0; i < length; i++) {
		  		var collegeObj = {
			  		name: collegeResults[i]["school.name"],
			  		url: collegeResults[i]["school.school_url"],
			  		city: collegeResults[i]["school.city"],
			  		state: collegeResults[i]["school.state"],
			  	};
		  		collegeArr.push(collegeObj);
	  		}

			userObj["college"] = collegeArr;
	  		res.render('user', userObj);
		}); // request
	} else  {
		res.render('user', userObj);
	} // location
}

// Utility function to convert to title case
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
