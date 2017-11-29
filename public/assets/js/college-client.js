/*
 * Handle all the Client side Javascript logic
 */

var userSignedIn = false;

// Function to display user specific data on the main page after successful login
function populateUserData(name) {
	//  Update the buttons to display "Sign Out" button
	var btnDisplay = $("#button-display");
	btnDisplay.empty();

	// Add "Sign Out" button
	btnDisplay.html('<button type="button" class="btn btn-default navbar-btn" id="sign-out">Sign Out</button>'); 

	userSignedIn = true;
}

// Click function for Sign In Credentials Submit button
function onLoginButton(event) {
	event.preventDefault();
	console.log("onLoginButton");

	var logInObj = {
		email: $("#email").val().trim(),
		password: $("#password").val().trim()
	}
	console.log(logInObj);

	// POST login data to the server and check the response
	$.ajax({
		method: "POST",
		url: "/user/signin",
		data: logInObj
	}).then(function(results) {
		// Successful login
		var name = results.name;
		populateUserData(name);
	}).fail(function(error) {

		// Login failed!
		console.log(error);
		var errDiv = $("<p>");
		errDiv.attr("id", "failed");
		errDiv.text("Login failed.  Try again!");
		$(".main-contents").prepend(errDiv); 
	});
}

// Click function for "Sign In " Button
function onSignInButton(event) {
	// If "Sign In" is clicked, make sure to now displya only "Sign Out" button
	// Also "Register button should not be displayed either"
	event.preventDefault();
	console.log("Sign In Clicked!");
	$(".main-contents").empty();
	var mainDiv = $(".main-contents");
	var htmlStr =  '<form> \
		  	<div class="form-group"> \
		   	 	<label for="email">Email address</label> \
		    	<input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email"> \
		    	<small id="emailHelp" class="form-text text-muted">We\'ll never share your email with anyone else.</small> \
		  	</div> \
		  	<div class="form-group"> \
		    	<label for="password">Password</label> \
		   		<input type="password" class="form-control" id="password" placeholder="Password"> \
		  	</div> \
	  	<button type="submit" class="btn btn-primary" id="login">Submit</button> \
		</form>';
	mainDiv.html(htmlStr); // Adds the html content
}

// Click function for "Sign Out" button
// Simply reload the webpage so it shows the initial welcome page
function onSignOutButton(event) {
	console.log("Sign Out Clicked!");
	event.preventDefault();
	location.reload();	
}

function onRegisterButton(event) {
	event.preventDefault();
	$(".main-contents").empty();
	console.log("Register Clicked!");
	var mainDiv = $(".main-contents");
	mainDiv.append("<h4>New User Registration</h4>");
	var htmlStr =  '<form> \
		  	<div class="form-group"> \
		   	 	<label for="reg-email">Email address</label> \
		    	<input type="email" class="form-control" id="reg-email" aria-describedby="emailHelp" placeholder="Enter email"> \
		    	<small id="emailHelp" class="form-text text-muted">We\'ll never share your email with anyone else.</small> \
		  	</div> \
		  	<div class="form-group"> \
		    	<label for="reg-password">Create Password</label> \
		   		<input type="password" class="form-control" id="reg-password" placeholder="Password"> \
		  	</div> \
		  	<div class="form-group"> \
		    	<label for="confirm">Confirm Password</label> \
		   		<input type="password" class="form-control" id="confirm" placeholder="Password"> \
		  	</div> \
	  	<button type="submit" class="btn btn-primary" id="register-user">Register</button> \
		</form>';
	mainDiv.append(htmlStr); // Adds the html content
}

// Click Handler for Register Button
function onRegisterSubmitButton(event) {
	event.preventDefault();

	if ($("#reg-password").val().trim() != $("#confirm").val().trim()) {
		var mainDiv = $(".main-contents");
		var errDiv = $("<p>");
		errDiv.attr("id", "failed");
		errDiv.text("Passwords don't match.  Try again!");
		mainDiv.prepend(errDiv);
	} else {
		// Post registration information to the Server
		var regObj = {
			email: $("#reg-email").val().trim(),
			password: $("#reg-password").val().trim()
		};

		$.ajax({
			method: "POST",
			url: "/user/register",
			data: regObj
		}).done(function(results) {
			// Successful registration
			var name = results.name;
			populateUserData(name);
		}).fail(function(error) {
			var mainDiv = $(".main-contents");
			var errDiv = $("<p>");
			errDiv.attr("id", "failed");
			errDiv.text("Registration failed.  Try again!");
			mainDiv.prepend(errDiv);
		});
	}
}

$(function() {
	// Declare all click handlers
	$(document).on("click", "#sign-in", onSignInButton);
	$(document).on("click", "#sign-out", onSignOutButton);
	$(document).on("click", "#register", onRegisterButton);
	$(document).on("click", "#register-user", onRegisterSubmitButton);
	$(document).on("click", "#login", onLoginButton);
});


