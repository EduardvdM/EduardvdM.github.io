jQuery(document).ready(function($) {

	var my_nav = $('.backscroll-true'); 
	// grab the initial top offset of the navigation 
	var sticky_navigation_offset_top = my_nav.offset().top;
	
	// our function that decides weather the navigation bar should have "fixed" css position or not.
	var sticky_navigation = function(){
		var scroll_top = $(window).scrollTop(); // our current vertical position from the top
		   
	};

	var initio_parallax_animation = function() { 
        $('.parallax').each(function(i, obj) {
            // Determine the appropriate speed based on screen size
            var speed;
            var width = window.innerWidth;
            
            if (width < 400) { // X-Small screens
                speed = $(this).attr('parallax-speed') || 5.0; // Default to 0.2 if not set
            } else if (width < 768) { // Small screens
                speed = $(this).attr('parallax-speed') || 3.2; // Default to 0.2 if not set
            } else if (width < 992) { // Medium screens
                speed = $(this).attr('parallax-speed') || 1.8; // Default to 0.4 if not set
            } else { // Large screens
                speed = $(this).attr('parallax-speed') || 0.8; // Default to 0.6 if not set
            }
    
            // Calculate the background position
            var background_pos = '-' + (window.pageYOffset / speed) + "px";
            $(this).css('background-position', 'center ' + background_pos);
        });
    }
	
	// run our function on load
	sticky_navigation();
	
	// and run it again every time you scroll
	$(window).scroll(function() {
		 sticky_navigation();
		 initio_parallax_animation();
	});

});