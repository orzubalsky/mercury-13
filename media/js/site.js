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
			
        this.initVimeo = function()
        {
            var self = this;
            
            var f = $('iframe'),
                url = f.attr('src').split('?')[0];

            // postMessage
            function post(action, value) {
                var data = { method: action };

                if (value) {
                    data.value = value;
                }

                f[0].contentWindow.postMessage(JSON.stringify(data), url);
            }

            // display event
            function onMessageReceived(e) {
                var data = JSON.parse(e.data);

                $('span').text(data.event);

                // Add listeners here
                if (data.event === 'ready') {
                    post('addEventListener', 'play');
                    post('addEventListener', 'pause');
                    post('addEventListener', 'finish');
                    post('play');
                }
                if (data.event == 'finish')
                {
                    alert('finished');                    
                    self.loadVideo('/videos/1/');                    
                }
            }            
    
            if (window.addEventListener){
                window.addEventListener('message', onMessageReceived, false);
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
 			    self.initVimeo();
 			});		    
		}
		
 		/*
 		 *  Change the source of the Vimeo iFrame player 
 		 */		
		this.editIframeSrc = function(vimeoCode)
		{
		    var src = 'http://player.vimeo.com/video/' + vimeoCode + '?api=1&amp;player_id=vimeoFrame';
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