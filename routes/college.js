/*
 * Contains all routes on the Server side. 
 */

// Dependencies
var db = require("../models");

var request = require('request');
var userObj = {};
var userId = 0;
var tasks = [];

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

app.get("/update-profile", function(req, res){
	res.render('update');
});
app.post("/update-profile", function(req, res) {
	console.log("Update Profile");
	console.log(req.body);
	db.User.update({
	  score: req.body.score,
	  gpa: req.body.gpa,
	  location: req.body.location,

	}, {
	  where: {
	    id: userId
	  }
	}).then(function(result){
		console.log("----");
		console.log(result);
		db.User.findOne({

		    where: {
		      id: userId
		    }
		  }).then(function(result){
		  	console.log(result);
		  	// Built the college data object to pass it to user.handlebars
	    	renderUserCollege(result, res, tasks);
		  })
	});

});

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
		    	// Save the current user in the global variable
		    	userId = result.id; 
		
		
				// Built the college data object to pass it to user.handlebars
		    	renderUserCollege(result, res, tasks);
		    	// res.render("user", result.dataValues);

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
			    // Save the current user in the global variable
		    	userId = result.id; 
		
				// Built the college data object to pass it to user.handlebars
		    	renderUserCollege(result, res, tasks);
			    // res.render("user", result.dataValues);
			  })
			  .catch(function(err) {
			    res.json(err);
			  });
		}
	}
});

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
        	
        	console.log(tasks);
			renderUserCollege(userObj, res, tasks);
      	});
      });
});

};

function renderUserCollege(data, res, todos){
	var location = data.location;

	var api_key = "TVS524kLUADDEEUcZl0PFHtEbVISmZCAGeT6buGi";
	var results = "&_fields=school.name,school.school_url,school.city,school.state";
	var query = "https://api.data.gov/ed/collegescorecard/v1/schools.json?_zip="+location+"&_distance=100mi&api_key="+ api_key + results;

	request(query, function (error, response, body) {
	  console.log('error:', error); // Print the error if one occurred
	  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

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
	  console.log(todos);
	  for (var i=0; i<todos.length; i++) {
	  	var taskObj = {
	  		task: todos[i].task
	  	};
	  	todoList.push(taskObj);
	  }
	  var userObj = buildUserObj(data, collegeArr, todoList);
	  res.render('user', userObj);
	 });
}

function buildUserObj(result, collegeArr, todoList) {
  	userObj = {
  		name: result.name,
  		email: result.email,
  		gpa: result.gpa,
  		score: result.score,
  		location: result.location,
  		college: collegeArr,
  		todoList: todoList
  	}
  	console.log(userObj);
  	return userObj;
}














