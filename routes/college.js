/*
 * Contains all routes on the Server side. 
 */

// Dependencies
var express = require("express");

// Routes for the Burger App
var router = express.Router();

router.get("/", function(req, res) {
	console.log("Welcome Page!");
	res.render('index');
});

router.get("/signin", function(req, res) {
	console.log("User Sign In");
	var userTypeObj = {
		newUser: false
	}
	res.render('signin', userTypeObj);	
});

router.get("/register", function(req, res) {
	console.log("New User Registration");
	var userTypeObj = {
		newUser: true
	}
	res.render('signin', userTypeObj);	
});

router.get("/contact", function(req, res) {
	console.log("Contact Us");
	res.render('contact');
});

router.get("/testimonials", function(req, res) {
	console.log("Testimonials");
	res.render('testimonials');
});

// Make the routes avaiable to external users
module.exports = router;