// Function to display user specific data on the main page after successful login
function populateUserData(name) {
	//  Update the buttons to display "Sign Out" button
	var btnDisplay = $("#button-display");
	btnDisplay.empty();

	// Add "Sign Out" button
	btnDisplay.html('<button type="button" class="btn btn-default navbar-btn" id="sign-out">Sign Out</button>'); 

	// Populate User Data here...
	// TODO **************

	$.ajax({
		method: "GET",
		url: "/user"
	}).then(function(results) {
		console.log("Get user!");
	});
}
