/*
 * Contains all routes on the Server side. 
 */

// Dependencies
var db = require("../models");
var request = require('request');
const util = require('util')

// Globals
var userObj;
var userId = 0;
var tasks = [];

// Define and export all routes to server.js
module.exports = function(app) {

	// Home page
	app.get("/", function(req, res) {
		console.log("Welcome Page!");
		res.render('index');
	});

	// Sign in Page for existing users
	app.get("/signin", function(req, res) {
		console.log("User Sign In");
		var userTypeObj = {
			newUser: false,
			error: ""
		}
		res.render('signin', userTypeObj);	
	});

	// Register new user page
	app.get("/register", function(req, res) {
		console.log("New User Registration");
		var userTypeObj = {
			newUser: true,
			error: ""
		}
		res.render('signin', userTypeObj);	
	});

	// Get Contact page
	app.get("/contact", function(req, res) {
		console.log("Contact Us");
		res.render('contact');
	});

	// Get Testimonials page
	app.get("/testimonials", function(req, res) {
		console.log("Testimonials");
		res.render('testimonials');
	});

	//  Get Update profile page
	app.get("/update-profile", function(req, res){
		res.render('update', userObj);
	});

	// Post from the Profile Update form
	app.post("/update-profile", function(req, res) {
		console.log("Update Profile for ID: " + userObj.id + " and " + userObj.name);

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

		console.log("Updated User Object: " + userObj);

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
	    	renderUserCollege(userObj, res, tasks);	
		});
	});

	// Post from the Sign In or Registrtion Form
	app.post("/profile", function(req, res) {
		console.log("Post User Sig In Data");
		if (Object.keys(req.body).length == 2) {
			// Existing User Sign In
			console.log("Existing User Sign In!");

			// Find the user in the database first
			db.User.findOne(
			{
			    where: {
			      email: req.body.email,
			      password: req.body.password
			    }
			})
			.then(function(result) {
			    if (result != null){
			    	// Save the current user in the global variable
			    	userId = result.id; 
					userObj = {
						id: result.dataValues.id,
						name: result.dataValues.name,
				  		email: result.dataValues.email,
				  		location: result.dataValues.location,
				  		gpa: result.dataValues.gpa,
				  		score: result.dataValues.score,
				  		college: [],
				  		todoList: []
					};
					console.log("Sign In User Data: " + util.inspect(userObj, { showHidden: true, depth: null }));
					renderUserCollege(userObj, res, tasks);

			    } else {
					// Make sure passwords match if not, display an error message and take the user back to Register page
			    	var userTypeObj = {
			    		newUser: false,
			    		error: "Email or password don't match, try again!"
			    	}	
			    	res.render("signin", userTypeObj);
			    }		  
			  });
		} else {
			// New User Registration
			console.log("New User Registration!");
			if (req.body.password != req.body.confirm) {
				// Make sure passwords match if not, display an error message and take the user back to Register page
				var userTypeObj = {
					newUser: true,
					error: "Passwords don't match, try again!"
				}	
				res.render("signin", userTypeObj);
			} else {
				// Successful Registration.  Add the user to the database
				// Note that username is same as email for now
				// Rember the user that logged in.  Save it global.
				userObj = {
					id: 0,
					name: req.body.name,
			  		email: req.body.email,
			  		password: req.body.password,
			  		college: [],
			  		todoList: []
				}

				db.User.create(
				{
					name: req.body.name,
				    username: req.body.email,
				    email: req.body.email,
				    password: req.body.password
				})
				.then(function(result) {
				    console.log("User Added to Database!")
    		    	userId = result.id; 
    		    	userObj["id"] = result.id;

    		    	//Note:  We don't have college or to-do list for the new user yet.
				  	res.render('user', userObj);
				});
			}
		}
	});

	// Todo Processing
	app.post("/todo", function(req, res) {
		db.Task.create({
	        task: req.body.task,
	        UserId: userId
	      }).then(function(result) {
	      	db.Task.findAll({
	        	// include: [db.User],
	        	where: {
	          		UserId: userId
	        	}
	      	})
	      	.then(function(result) {
	      		console.log(result);
	        	// Built the college data object to pass it to user.handlebars
	        	tasks = [];
	        	for (var i=0; i< result.length; i++) {
	        		var taskObj = {task: result[i].task};
	        		tasks.push(taskObj);
	        	}
	        	userObj.todoList = tasks;
	        	console.log(tasks);
				renderUserCollege(userObj, res, tasks);
	      	});
	      });
	});
};

// Function to render College Data for a given location
function renderUserCollege(data, res, todos){
	
	var location = data.location;

	if (location != null) {
		var api_key = "TVS524kLUADDEEUcZl0PFHtEbVISmZCAGeT6buGi";
		var results = "&_fields=school.name,school.school_url,school.city,school.state";
		var query = "https://api.data.gov/ed/collegescorecard/v1/schools.json?_zip="+location+"&_distance=100mi&api_key="+ api_key + results;

		// API to get College Data
		request(query, function (error, response, body) {

	 		console.log('College Data Error:', error); // Print the error if one occurred
	  		console.log('College Data Status Code:', response && response.statusCode); // Print the response status code if a response was received

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

		  	var todoList = [];
		  	for (var i=0; i<todos.length; i++) {
		  		var taskObj = {
		  			task: todos[i].task
		  		};
		  		todoList.push(taskObj);
		  	}

			userObj["college"] = collegeArr;
	  		userObj["todoList"] = todoList;
	  		res.render('user', userObj);
		}); // request
	} else  {
		res.render('user', userObj);
	} // location
}















