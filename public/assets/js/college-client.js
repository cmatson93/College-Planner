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

$(document).ready(function(){
    $("#testimonial-slider").owlCarousel({
        items:1,
        itemsDesktop:[1000,1],
        itemsDesktopSmall:[979,1],
        itemsTablet:[768,1],
        pagination:false,
        navigation:true,
        navigationText:["",""],
        slideSpeed:1000,
        autoPlay:true
    });
});
