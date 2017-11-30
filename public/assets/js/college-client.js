/*
 * Handle all the Client side Javascript logic
 */
 
$(function() {
	// Declare all click handlers
	$(document).on("click", "#contact", function() {
		location.href = "/contact";
	});

	$(document).on("click", "#testimonials", function() {
		location.href = "/testimonials";
	});
});


