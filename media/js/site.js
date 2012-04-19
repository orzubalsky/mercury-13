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
            this.pageSelection();
		};
			
			
		/*
		 *  Clicking on a thumbnail displays the target video
		 */	
		this.videoSelection = function() 
		{		    
		    var self = this;
		    
		    $('#allVideos > a').live('click', function(e) 
		    {
		        e.preventDefault();
		        self.displayVideo(this);
		    });
		};
		

		/*
		 *  Display selected video
		 *  @param data received from ajax call
		 */
		 this.displayVideo = function(anchor)
		 {
		    var container = $('#mainVideo');
		    
 			lib.ajax($(anchor).attr('href'), '', 'json', container, function(data) 
 			{
 			    var code    = data[0].fields.code;
    			var author  = data[0].fields.author;
    			var page    = data[0].fields.page;
    			var src     = 'http://player.vimeo.com/video/' + code + '?title=0&amp;byline=0&amp;portrait=0';
    			var html = '<iframe width="400" height="300" frameborder="0" allowfullscreen="" mozallowfullscreen="" webkitallowfullscreen="" src="http://player.vimeo.com/video/' + code + '?title=0&amp;byline=0&amp;portrait=0"></iframe>';
    			
                $('#vimeoFrame').attr('src', src);
    			
 			});
		 };
		 
		 
		 
 		/*
 		 *  Clicking on a nav anchor displays the page
 		 */	
 		this.pageSelection = function() 
 		{		    
 		    var self = this;

 		    $('#container > a').live('click', function(e) 
 		    {
 		        e.preventDefault();
 		        self.loadView(this);
 		    });
 		};
 		
 				 
 		/*
 		 *  Populate main content via ajax according to page requested  
 		 */
 		 this.loadView = function(anchor)
 		 {
 		    var container = $('#main');

  			lib.ajax($(anchor).attr('href'), '', 'html', container, function(data) 
  			{
     			$(container).empty().html(data);
  			});
 		 };		 
	};
})(jQuery);


/*
 *  Good old fashioned document-ready function call. Starting js action.
 */
$(document).ready(function()
{   
	site.init();
});