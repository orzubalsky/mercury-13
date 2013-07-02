/*
 *  "Do You Consider Yourself a Candidate for Space Travel?"
 *  @authors The Youngest, (youngestforever@gmail.com), 2012
 *
 */

;(function($){
	var site = window.site = new function() 
	{	    
	    this.videoId = 3;
	    this.playing = false;
	    this.indexHeight = 0;
	    this.csrvToken = '';
	    
	    /*
	     *  These functions are called when the document loads
	     */
		this.init = function() 
		{		
		    this.storeCsrvToken();
		    this.getIndexHeight();    
		    this.initVimeo();
            this.videoSelection();
            this.pageSelection();	
            // this.formLabels();	   
            this.changePages(); 
            this.formValues();
		};	
		
		
		this.storeCsrvToken = function() 
		{
            this.csrvToken = $('input[name="csrfmiddlewaretoken"]').val();
		};
		
		
		this.formValues = function() 
		{
        	// the input box element
			var inputbox = $('#id_author');

			// the input box's default value 
			var defaultValue = $(inputbox).val();

			$(inputbox).live('focus', function() {
				$(this).val('');
			})
			.live('blur', function() {
				if ($(this).val().length < 1) {
					$(inputbox).val(defaultValue);
				}
			});
			
        	// the input box element
			var inputbox = $('#id_message');

			// the input box's default value 
			var defaultValue = $(inputbox).val();

			$(inputbox).live('focus', function() {
				$(this).val('');
			})
			.live('blur', function() {
				if ($(this).val().length < 1) {
					$(inputbox).val(defaultValue);
				}
			});			
		};	
		
		
		this.changePages = function()
		{
		    var self = this;
		    
		    var randomIndex = lib.random(84,0);
		    var option = $('#selectPage option').eq(randomIndex);          
            $('#selectPage option').eq(randomIndex).attr('selected', 'selected');
            self.changePage(option);	    
		    
            $('#selectPage').change(function() 
            {
    		    var option = $('option:selected', this);          
                self.changePage(option);
            });		    
		};
		
		
		this.changePage = function(optionElement)
		{
            $('#pdf img').attr('src', $(optionElement).val());
			$('#id_page_number').val($(optionElement).text());		    
		};
		
		
		this.formLabels = function()
	    {
            $('label').jLabel({ speed : 20, opacity : 0.1 });
	    };
	    
		
		this.getIndexHeight = function()
		{
		    var self = this;
		    self.indexHeight = $('#allVideos').height();
		    $('#videoInfo').css({'bottom':(self.indexHeight+14) + 'px'});
		};
		
		this.resizeVideoFrame = function()
		{
		    var self = this;
		    
		    var browserWidth    = $(window).width();
		    var browserHeight   = $(window).height();
		    var frameHeight = browserWidth * 3 / 4;
		    var scrollOffset = (frameHeight - browserHeight) / 2;
		    
		    // resize the video to fit the width of the browser
            $('#vimeoFrame')
            .attr('width', browserWidth)		    		    
            .attr('height', frameHeight);
		    
            $('#controlLayer').css({'width':browserWidth+'px', 'height':frameHeight+'px'});		    		    
		    
		    $('#mainVideo').css({'height':(frameHeight + self.indexHeight - 8) + 'px'});
		    
            $('html, body').animate({scrollTop: scrollOffset}, 0);  
		};
			
        this.initVimeo = function()
        {
            var self = this;

            if ($('#vimeoFrame').size() > 0)
            {
                $('#vimeoFrame').css({opacity:0});
    		    self.resizeVideoFrame();

                var f = $('iframe'),
                    url = f.attr('src').split('?')[0];

                // postMessage
                function post(action, value) 
                {
                    var data = { method: action };

                    if (value) {
                        data.value = value;
                    }

                    f[0].contentWindow.postMessage(JSON.stringify(data), url);
                }

                // display event
                function onMessageReceived(e) 
                {
                    var data = JSON.parse(e.data);

                    // Add listeners here
                    if (data.event === 'ready') {
                        post('addEventListener', 'play');
                        post('addEventListener', 'pause');
                        post('addEventListener', 'finish');
                        post('play');
                        self.playing = true;
                    }
                    if (data.event == 'finish')
                    {
                        self.nextVideoId();                   
                    }
                }

                if (window.addEventListener)
                {
                    window.addEventListener('message', onMessageReceived, false);
                }

                $('#controlLayer').live('click', function(e) 
                {
                    if (self.playing == true) {
                        post('pause');
                        self.playing = false;
                    } else {
                        post('play');
                        self.playing = true;                    
                    }
                });

                $('#vimeoFrame').css({opacity:1});
            }
        };
        
        
        this.nextVideoId = function()
        {
            var self = this;
            
 			lib.ajax('/' + self.videoId + '/next/', '{ csrfmiddlewaretoken:' + self.csrvToken + '}', 'json', '', function(data) {
 			    self.videoId = data[0].pk;
                self.loadVideo('/' + self.videoId + '/');                    
 			});            
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
 			lib.ajax(url, '{ csrfmiddlewaretoken:' + self.csrvToken + '}', 'json', container, function(data) { 
 			    self.editIframeSrc(data[0].fields.code); 
 			    $('#videoInfo p').html('<strong>PAGE ' + data[0].fields.page + '</strong>: ' + data[0].fields.author);
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
      			    '{ csrfmiddlewaretoken:' + self.csrvToken + '}', 
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