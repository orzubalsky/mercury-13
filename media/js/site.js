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
		 *  Clicking on a thumbnail extracts the video's id 
		 *  and displays the target video
		 */	
		this.videoSelection = function() 
		{		    
		    var self = this;
		    
		    $('#allVideos > a').live('click', function(e) 
		    {
		        e.preventDefault();
		        var id = lib.getId($(this).attr('id'));
		        self.displayVideo(id);
		    });
		};
		

		/*
		 *  Display selected video
		 *  @param data received from ajax call
		 */
		 this.displayVideo = function(id)
		 {
		    var container = $('#mainVideo');
		    
 			lib.ajax('/videos/', 'pk='+id, function(data) 
 			{
 			    var code    = data[0].fields.code;
    			var author  = data[0].fields.author;
    			var page    = data[0].fields.page;
    			var html = '<iframe width="400" height="300" frameborder="0" allowfullscreen="" mozallowfullscreen="" webkitallowfullscreen="" src="http://player.vimeo.com/video/' + code + '?title=0&amp;byline=0&amp;portrait=0"></iframe>';
    			
    			$(container).empty().html(html);
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