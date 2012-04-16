;(function($){
	var lib = window.lib = new function() {
		this.init = function() {
			this.customScrollbars();
		},
		this.center = function(element, container) 
		{
			var containerWidth = $(container).outerWidth();
			var containerHeight = $(container).outerHeight();
			
			var width = $(element).width();
			var height = $(element).height();
			
			
			var top = (containerHeight - height) / 2;
			var left = (containerWidth - width ) / 2;
						
			$(element).css({'top':top+'px', 'left':left+'px'});
		},
        this.editUrl = function(targetUrl) 
		{
			var self = this;
			var base = window.location.href;

			var baseArray = new Array();
			baseArray = base.split('/');
			
			var urlPath = base.replace(currentPage, targetUrl);

			if ( history.pushState ) {
				window.history.pushState({'page':self.subpage, 'mirror':self.mirror},"", urlPath);	
			}		
			
			window.onpopstate = function(e)
			{

			}				
		},		
		this.postAjaxCalls = function() 
		{
			$('label').inFieldLabels();
			this.customScrollbars();
		},
		this.customScrollbars = function() 
		{
			 $("#story").mCustomScrollbar("vertical",400,"easeOutCirc",1.05,"auto","yes","yes",10);
			 $("#previewedSoundComments").mCustomScrollbar("vertical",400,"easeOutCirc",1.05,"auto","yes","no",10);
		},
		this.cycle = function(items, intervalMs) 
		{
			var count = $(items).size();
			
			$(items).css({'opacity':0});
			$(items).eq(0).css({'opacity':1});
			
			var i = 0;
			var interval = setInterval(function() 
			{
				var next = (i < count-1) ? i+1 : 0;
				
				$(items).eq(i).animate({
					opacity	: 0
				}, 1000);
				$(items).eq(next).animate({
					opacity	: 1
				}, 1000);	
				i = (i < count-1) ? i+1 : 0;
			}, intervalMs);
		},				
		this.ajax = function(url, data, successCallback, container) 
		{
			var self = this;
			
			$('#slothLoader').appendTo(container).show();
			
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: url,
				data: data,
				success: function(data){
					$('#slothLoader').hide().appendTo('body');
					successCallback(data);
					self.postAjaxCalls();
				}
			});
		},
		this.lightbox = function(openCallback, closeCallback)
		{
			var self = this;
			
			$('#screen').fadeIn(300, function() {
				$(this).addClass('open');
				openCallback();
				
				$('#screen').click(function(e) {
					closeCallback();
					self.hideLightbox();
				});
			});				
		},
		this.hideLightbox = function() 
		{
			$('#screen').fadeOut(200);
		},
		this.getController = function(controllers) {
			var self = this;
			var pathname = window.location.pathname;
			var controller;
			for (var i=0; i<controllers.length; i++) {
				var query = new RegExp(controllers[i], 'i');
				if (pathname.search(query) > 0) { controller = controllers[i]; }
			}
			return controller;
		},	
		this.isLoaded = function(elementId)
		{
			// try to get the contents of an element
			var element = document.getElementById(elementId).contentDocument;

			// if nothing is returned (not loaded), return false, otherwise (loaded!) return true
			return (element == null) ? false : true;
		},			
		this.inArray = function(needle, haystack) {
		    var length = haystack.length;
		    for(var i = 0; i < length; i++) {
		        if(haystack[i] == needle) return true;
		    }
		    return false;
		},
		this.log = function(s) {
			if (window.console) {
				console.log(s);
			}
		},
		this.random = function(max, add) {
			return Math.floor(Math.random()*max+add);
		},
		this.isEmail = function isEmail(email){
			return /^[\w-+\.]+@([\w-]+\.)+[\w-]{2,}$/i.test(email);
		},
		this.getId = function(idString) {
			 return idString.substring((idString.search('_')+1));
		},
		this.partial = function(func /*, 0..n args */) {
			var args = Array.prototype.slice.call(arguments, 1);
			return function() {
				var allArguments = args.concat(Array.prototype.slice.call(arguments));
				return func.apply(this, allArguments);
			};
		},
		this.include = function(script,callback){
		    $.getScript(script, function() {
		        if(typeof callback == 'function')
		        callback.apply({},arguments);
		    });
		};		
	};
})(jQuery);

(function ($) {
	   jQuery.fn.liveDraggable = function (opts) {
	      this.live("mouseover", function() {
	         if (!$(this).data("init")) {
	            $(this).data("init", true).draggable(opts);
	         }
	      });
	   };
})(jQuery);


$.widget( "custom.catcomplete", $.ui.autocomplete, {
	_renderMenu: function( ul, items ) {
		var self = this,
			currentCategory = "";
		$.each( items, function( index, item ) {
			if ( item.category != currentCategory ) {
				ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
				currentCategory = item.category;
			}
			self._renderItem( ul, item );
		});
	}
});	


(function($){

    var special = jQuery.event.special,
        uid1 = 'D' + (+new Date()),
        uid2 = 'D' + (+new Date() + 1);

    jQuery.event.special.focus = {
        setup: function() {
            var _self = this,
                handler = function(e) {
                    e = jQuery.event.fix(e);
                    e.type = 'focus';
                    if (_self === document) {
                        jQuery.event.handle.call(_self, e);
                    }
                };

            jQuery(this).data(uid1, handler);

            if (_self === document) {
                /* Must be live() */
                if (_self.addEventListener) {
                    _self.addEventListener('focus', handler, true);
                } else {
                    _self.attachEvent('onfocusin', handler);
                }
            } else {
                return false;
            }

        },
        teardown: function() {
            var handler = jQuery(this).data(uid1);
            if (this === document) {
                if (this.removeEventListener) {
                    this.removeEventListener('focus', handler, true);
                } else {
                    this.detachEvent('onfocusin', handler);
                }
            }
        }
    };

    jQuery.event.special.blur = {
        setup: function() {
            var _self = this,
                handler = function(e) {
                    e = jQuery.event.fix(e);
                    e.type = 'blur';
                    if (_self === document) {
                        jQuery.event.handle.call(_self, e);
                    }
                };

            jQuery(this).data(uid2, handler);

            if (_self === document) {
                /* Must be live() */
                if (_self.addEventListener) {
                    _self.addEventListener('blur', handler, true);
                } else {
                    _self.attachEvent('onfocusout', handler);
                }
            } else {
                return false;
            }

        },
        teardown: function() {
            var handler = jQuery(this).data(uid2);
            if (this === document) {
                if (this.removeEventListener) {
                    this.removeEventListener('blur', handler, true);
                } else {
                    this.detachEvent('onfocusout', handler);
                }
            }
        }
    };
})(jQuery);


$(document).ready(function(){
	lib.init();
});		