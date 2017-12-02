/*
 * Contains all routes on the Server side. 
 */

// Dependencies
var db = require("../models");

module.exports = function(app){



app.get("/", function(req, res) {
	console.log("Welcome Page!");
	res.render('index');
});

app.get("/signin", function(req, res) {
	console.log("User Sign In");
	var userTypeObj = {
		newUser: false,
		error: ""
	}
	res.render('signin', userTypeObj);	
});

app.get("/register", function(req, res) {
	console.log("New User Registration");
	var userTypeObj = {
		newUser: true,
		error: ""
	}
	res.render('signin', userTypeObj);	
});

app.get("/contact", function(req, res) {
	console.log("Contact Us");
	res.render('contact');
});

app.get("/testimonials", function(req, res) {
	console.log("Testimonials");
	res.render('testimonials');
});

app.get("/profile", function(req, res){
	res.render('user', data);
})

app.post("/profile", function(req, res) {
	console.log("Post User Data");
	console.log(req.body);
	if (Object.keys(req.body).length == 2) {
		// Regular log in
		// Add code here ...
		console.log("Existing user");
		db.User.findOne({

		    where: {
		      email: req.body.email,
		      password: req.body.password
		    }
		  })
		  .then(function(result) {

		    console.log(result);
		    if (result != null){
		    	res.render("user", result.dataValues);
		    } else {
		    	var userTypeObj = {
		    		newUser: false,
		    		error: "Email or password don't match, try again!"
		    	}	
		    	res.render("signin", userTypeObj);
		    }		  
		  });
	} else {
		// New User Registration
		// Add code here ...
		console.log("Creating user");
		if (req.body.password != req.body.confirm) {
			var userTypeObj = {
				newUser: true,
				error: "Passwords don't match, try again!"
			}	
			res.render("signin", userTypeObj);
		} else {

			db.User.create({
				name: req.body.name,
			    username: req.body.email,
			    email: req.body.email,
			    password: req.body.password,
			    location: req.body.location,
			    gpa: req.body.gpa
			  }).then(function(result) {
			    console.log(result);
			    res.render("user", result.dataValues);
			  })
			  .catch(function(err) {
			    res.json(err);
			  });
		}
	}
});

};