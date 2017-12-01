/*
 * Contains all routes on the Server side. 
 */

// Dependencies
module.exports = function(app){



app.get("/", function(req, res) {
	console.log("Welcome Page!");
	res.render('index');
});

app.get("/signin", function(req, res) {
	console.log("User Sign In");
	var userTypeObj = {
		newUser: false
	}
	res.render('signin', userTypeObj);	
});

app.get("/register", function(req, res) {
	console.log("New User Registration");
	var userTypeObj = {
		newUser: true
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
	res.render('user');
})

app.post("/profile", function(req, res) {
	console.log("Post User Data");
	console.log(req.body);
	if (Object.keys(req.body).length > 2) {
		// Regular log in
		// Add code here ...
	} else {
		// New User Registration
		// Add code here ...
	}
	res.render('user', req.body); // If successful for now
	// Add code here to handle auth fail ...
});

};