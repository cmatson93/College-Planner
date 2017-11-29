/*
 * Handle all the Client side Javascript logic
 */

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
		console.log("Post Successful");
		// var name = results.name;
		// populateUserData(name);
	}).fail(function(error) {
		// Login failed!
		console.log(error);
		var errDiv = $("<p>");
		errDiv.attr("id", "failed");
		errDiv.text("Login failed.  Try again!");
		$(".main-contents").prepend(errDiv); 
	});
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
	$(document).on("click", "#contact", function() {
		location.href = "/contact";
	});

	$(document).on("click", "#testimonials", function() {
		location.href = "/testimonials";
	});
});


