/*
 *  "Do You Consider Yourself a Candidate for Space Travel?"
 *  @authors The Youngest, (youngestforever@gmail.com), 2012
 *
 */

;(function($){
	var site = window.site = new function() 
	{
	    /*
	     *  These functions are called when the document loads
	     */
		this.init = function() 
		{
            this.videoSelection();
		};
			
			
		/*
		 *  Request a video when a thumnail is clicked
		 */	
		this.videoSelection = function() 
		{
		};
		

		/*
		 *  Display selected video
		 *  @param data received from ajax call
		 */
		 this.displayVideo = function()
		 {
 			lib.ajax('/videos', 2, function(data) 
 			{
    			lib.log(data);		      			    
 			});
		 };
	};
})(jQuery);


/*
 *  Good old fashioned document-ready function call. Starting js action.
 */
$(document).ready(function(){
	site.init();
});