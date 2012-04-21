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
		    this.initVimeo();
            this.videoSelection();
            this.pageSelection();		    
		};	
			
		/*
		 *  Wait for the vimeo player ready event and bind events
		 */	
		this.initVimeo = function() 
		{		    
		    var self = this;
            
            // Listen for the ready event for any vimeo video players on the page
            var vimeoPlayers = document.querySelectorAll('iframe'), player;

            for (var i = 0, length = vimeoPlayers.length; i < length; i++) {
                player = vimeoPlayers[i];
                $f(player).addEvent('ready', self.vimeoReady);
            } 
		};
		
		/*
		 *  When the vimeo player is ready, start playing and bind finish event
		 */		
		this.vimeoReady = function(player_id) 
		{
		    var self = this;
            $f(player_id).addEvent('finish', finish);                
            $f(player_id).api('play');		
            
            function finish()
            {
                self.loadVideo('/video/1/');
            }                
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
                self.loadVideo($(this).attr('href'));
		    });
		};

 		/*
 		 *  Ajax a new video
 		 */		
		this.loadVideo = function(url)
		{            
		    var self = this;
		    var container = $('#mainVideo');
 			lib.ajax(url, '', 'json', container, function(data) { 
 			    self.editIframeSrc(data[0].fields.code); 
 			});		    
		}
		
 		/*
 		 *  Change the source of the Vimeo iFrame player 
 		 */		
		this.editIframeSrc = function(vimeoCode)
		{
		    var src     = 'http://player.vimeo.com/video/' + vimeoCode + '?api=1&amp;player_id=vimeoFrame';
            $('#vimeoFrame').attr('src', src);		    
		}
		 
 		/*
 		 *  Clicking on a nav anchor displays the page
 		 */	
 		this.pageSelection = function() 
 		{		    
 		    var self = this;

 		    $('#container > a').live('click', function(e) 
 		    {
 		        e.preventDefault();
     		   
     		    var container = $('#main');

      			lib.ajax(
      			    $(this).attr('href'), 
      			    '', 
      			    'html', 
      			    container, 
      			    function(data) { $(container).empty().html(data); }
      			); 		    
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