;(function($){
	var site = window.site = new function() {
		this.swfu;
		this.subpage = '';
		this.mirror = '';
		this.subpageAjaxCalls = 0;
		this.init = function()
		{
			// set all events
			this.screenResolutionTest();
			this.landing();
			this.contactForm();
			this.teamHovers();
			this.shadowbox();
			this.mirrorSelection();
			this.subpageTransitions();
			this.logoClicks(); 
			this.videoClick();
			this.rightHover();
			this.loadShareLinks();
			
			// layout index page
			site.layout.applyHomeLayout();
			window.setTimeout(function() { site.layout.setScrollBar(); }, 80);	
			
			// hide typekit icon
			window.setTimeout(function() { $('.typekit-badge').hide(); }, 100);
						
			$('.welcome').fadeOut(600, function() { $('.welcome').remove(); });			
		},
		this.screenResolutionTest = function()
		{
			var screenHeight = window.screen.availHeight;
			var screenWidth	 = window.screen.availWidth;

			if (screenWidth < 1024) 
			{
				window.location = baseUrl + "/../mobile";				
			}
		},		
		this.landing = function() 
		{
			var self = this;
			var layout = this.layout;
						
			$("#tech").css('left','-'+layout.browserWidth+'px');
			$("#creative").css('left',layout.browserWidth+'px');
			self.mirror = mirror;
			self.subpage = subpage;
			
			// if entered directly into a content page
			if (subpage.length > 0) 
			{
				self.skipMirrorSelection();
				window.setTimeout(function() {
					self.loadSubpage(true,"tech");
					self.loadSubpage(true,"creative");
				}, 40);		
				self.editUrl(subpage);						
			} 
			// else - entered to root 
			else
			{
				self.subpage = "index";
				window.setTimeout(function() {
					self.loadSubpage(true,"tech");
					self.loadSubpage(true,"creative");
				}, 40);	
				self.landingAnimation(false);
				self.editUrl('');										
			}
		},
		
		$.fn.transform = function(x,y) {
			return this.each(function(e) {
				$(this).css({
				   "-moz-transform": 	"translate("+x+","+y+")",
				   "-webkit-transform": "translate("+x+","+y+")",
				   "-o-transform":		"translate("+x+","+y+")",
				   msTransform: 		"translate("+x+","+y+")"
				});
			});
		};				
		$.fn.transformString = function(string) {
			return this.each(function(e) {
				$(this).css({
				   "-moz-transform": 	string,
				   "-webkit-transform": string,
				   "-o-transform":		string,
				   msTransform: 		string
				});
			});
		};		
		$.fn.transitionDuration = function(duration) {
			return this.each(function(e) {
				$(this).css({
				   "-moz-transition-duration": 	  duration+"s",
				   "-webkit-transition-duration": duration+"s",
				   "-o-transition-duration": 	  duration+"s",
				   msTransitionDuration:     	  duration+"s"
				});
			});
		};		
		$.fn.transitionDelay = function(delay) {
			return this.each(function(e) {
				$(this).css({
				   "-moz-transition-delay":    delay+"s",
				   "-webkit-transition-delay": delay+"s",
				   "-o-transition-delay": 	   delay+"s",
				   msTransitionDelay:   	   delay+"s",
				});
			});
		};	

		this.loadShareLinks = function() 
		{
			// Load share links to footer
			var data = {page : 'share-links', mirror : 'tech'};
			var url = baseUrl + '/../ajax/index/subpage/';
			var onSuccess = function(data) {
				$('.footer .shareLinks').html(data);
			}
			lib.ajax(url, data, onSuccess);		
		},		
		this.loadVideoObject = function() 
		{	
			var data = {page : 'video-object', mirror : 'tech'};
			var url = baseUrl + '/../ajax/index/subpage/';
			var onLoadVideoSuccess = function(data) {
				$('#techVideoContainer').html(data);
				$('#creativeVideoContainer').html(data);
			}
			lib.ajax(url, data, onLoadVideoSuccess);		
		},
		this.contactForm = function() 
		{
			var self = this;		
			$('form#contactForm').live('submit', function(e) 
			{
				e.preventDefault();
				
				var requiredFields	= ['name','email', 'message'];
				var postUrl			= baseUrl + '/../index/contact/mirror/' + self.mirror + '/page/' + self.subpage;
				var onSuccess		= function(data) 
				{
					// console.log(data.html);
					$('#contactFormContainer').empty().html(data.html).show();
				};
						
				new site.Form(this, requiredFields, postUrl, onSuccess);
			});
		},		
		this.teamHovers = function() 
		{
			$('.teamMember').live('hover', function(e) 
			{
				//e.preventDefault();
				$(this).toggleClass('hovered');	
			});
		},
		this.logoClicks = function() 
		{
			var self = this;
			var layout = this.layout;
				
			$('.header .logo').live('click', function(e) 
			{
				e.preventDefault();
				
				self.stopVideo();
				self.mirror = "";	
				self.subpage = "index";	
				site.layout.applyLandingLayout();
				self.landingAnimation(false);
				self.loadSubpage(false,"tech",true);
				self.loadSubpage(false,"creative",true);
				self.editUrl('');									
				
				$("#techBack, .leftFace, .leftArrow").bind('mouseenter', function(e) {
					self.leftHover();
				});
				$("#creativeBack, .rightFace, .rightArrow").bind('mouseenter', function(e) {
					self.rightHover();
				});
				/*
				// determine target page
				var targetPage = 'index';
				
				// switch page if different than currently displayed page
				if (targetPage != self.subpage)
				{
					self.subpage = targetPage;
					self.loadSubpage(false,self.mirror);
				}
				*/
			});		
		},
		this.videoClick = function() 
		{
			var self = this;

			$('.creativePlaceholder,#creative .playButton').live('click', function(e) 
			{
				e.preventDefault();
				var player = document.getElementById("videoPlayer");
				window.setTimeout(function() { $('.video .creativePlaceholder,#creative .video .playButton').hide(); }, 250);	
				try { player.toggle_play(); }
				catch(e){ }	
			});				
			$('.techPlaceholder,#tech .playButton').live('click', function(e) 
			{
				e.preventDefault();
				var player = document.getElementById("videoPlayer");
				window.setTimeout(function() { $('.video .techPlaceholder,#tech .video .playButton').hide(); }, 250);	
				try { player.toggle_play(); }
				catch(e){ }	
			});		
		},
		this.subpageTransitions = function() 
		{
			var self = this;
			var layout = this.layout;
			$('.navigation a, .footer a').live('click', function(e) 
			{
				e.preventDefault();
								
				// determine target page
				var targetPage = $(this).attr('class');
				
				// switch page if different than currently displayed page
				if (targetPage != self.subpage)
				{
					self.subpage = targetPage;
					self.loadSubpage(false,"tech");
					self.loadSubpage(false,"creative");
					self.editUrl(targetPage);					
				}
			});
		},		
		this.stopVideo = function() 
		{
			var player = document.getElementById("videoPlayer");
			try { player.stop_video(); }
			catch(e){ }	
		},
		this.loadSubpage = function(skip, loadMirror, noFade) 
		{
			var self = this;
			
			if (skip) {
				$('.main .draggableContent').empty();				
			}
			
			var fadeOutDuration = (skip) ? 0 : 200;
			var fadeInDuration = (skip) ? 0 : 700;
			if (noFade) {
				fadeOutDuration = 0;
				fadeInDuration = 0;
			}
			
			var data = {page : self.subpage, mirror : loadMirror};
			var url = baseUrl + '/../ajax/index/subpage/';
			var onSuccess = function(data) {
				// after the data is loaded, there are 5 steps happening:
				
				// STEP1 - fading out the current page, changing the header to selected class
				$("#"+loadMirror).find('.main .customScrollBox').fadeOut(fadeOutDuration, function() 
				{
					$('.navigation a').removeClass('selected');
					var anchorClass = (self.subpage == 'index') ? 'home' : self.subpage;					
					$('.navigation a.' + anchorClass).addClass('selected');
					$("#"+loadMirror).find('.main .draggableContent').empty().html(data);
					$("#"+loadMirror).find('.main .customScrollBox').show().css('visibility','hidden');		
					$("#"+loadMirror).find('.video .project .videoObject').css('visibility','visible');

					// STEP2 - applying layout for current page
					window.setTimeout(  
						function() {  
							switch (self.subpage) {
								case "" :
									self.loadVideoObject();
									site.layout.applyHomeLayout();
									break;								
								case "index" :
									self.loadVideoObject();
									site.layout.applyHomeLayout();
									break;
								case "home" :
									self.loadVideoObject();
									site.layout.applyHomeLayout();
									break;									
								case "projects" :
									site.layout.applyProjectsLayout();
									break;
								case "contact" :
									site.layout.applyContactLayout(loadMirror);
									break;								
								case "team" :
									site.layout.applyAboutLayout();
									break;				
								case "products" :
									site.layout.applyProductsLayout();
									break;	
								default :
									site.layout.applyContentPageLayout();
							}
						},  
						40  
					);											
					
					// STEP3 - applying scrollbar
					window.setTimeout(function() { site.layout.setScrollBar(); }, 80);	

					// STEP4 - showing new layed-out page with scrollbar set
					window.setTimeout(  
						function() {  
							$("#"+loadMirror).find('.main .customScrollBox').css('visibility','visible').hide().fadeIn(fadeInDuration);
						},  
						90
					);		
					
					// STEP5 - change url path			
					// self.editUrl(self.subpage);
						
				});
			}
			lib.ajax(url, data, onSuccess);		
		},
		this.editUrl = function(targetUrl) 
		{
			var self = this;
			var base = window.location.href;

			var baseArray = new Array();
			baseArray = base.split('/');
			//for(var i=0; i<baseArray.length; i++) { alert(baseArray[i]); }

			var interludeIndex = lib.inArray('interlude', baseArray);

			// currentPage is the subpage element in the url array
			if(interludeIndex==false) {
				var currentPage = baseArray[baseArray.length-1];
			}
			else {
				var currentPage = baseArray[interludeIndex+1];
			}
			// if it's set, we are already in a subpage
			if (currentPage.length > 0)
			{
				// replace the current page with the target page
				// var urlPath = (self.subpage == 'index') ? base.replace(currentPage, '') : base.replace(currentPage, self.subpage);
				var urlPath = base.replace(currentPage, targetUrl);
			}
			// we are on the home page
			else 
			{
				// append the target page to the url line
				// var urlPath = base + self.subpage;
				var urlPath = base + targetUrl;				
			}

			// this is supposed to be for explorer, not working tho...
			//var History = window.History;
			//History.pushState({'page':self.subpage, 'mirror':self.mirror},"", urlPath);	

			if ( history.pushState ) {
				window.history.pushState({'page':self.subpage, 'mirror':self.mirror},"", urlPath);	
			}		
			
			window.onpopstate = function(e){
				self.subpage = e.state.page;
				self.mirror = e.state.mirror;
				self.loadSubpage(false,self.mirror);		
			}				
		},
		this.skipMirrorSelection = function() 
		{
			var self = this;			
			self.faceFold(true);
			
			if (self.mirror == 'tech')
			{
				self.leftFold(true);
				//self.backsShake(true);
			}
			else 
			{
				self.rightFold(true);
				//self.backsShake(true);			
			}	
		},
		this.landingAnimation = function(skip)
		{	
			var self = this;
									
			$("#techBack, .leftFace, .leftArrow").live('click', function(e) {	
				e.preventDefault();
	
				$("#techBack, .leftFace, .leftArrow").unbind('mouseenter');
				$("#creativeBack, .rightFace, .rightArrow").unbind('mouseenter');
			
				self.faceFold(skip);
				self.leftFold(skip);
				self.mirror = 'tech';
				self.editUrl('home');				
				$('.navigation a.home').addClass('selected');
			});
			$("#creativeBack, .rightFace, .rightArrow").live('click', function(e) {
				e.preventDefault();
				
				$("#techBack, .leftFace, .leftArrow").unbind('mouseenter');
				$("#creativeBack, .rightFace, .rightArrow").unbind('mouseenter');
			
				self.faceFold(skip);
				self.rightFold(skip);
				self.mirror = 'creative';
				self.editUrl('home');								
								
				$('.navigation a.home').addClass('selected');
			});
			
			$("#techBack, .leftFace, .leftArrow").bind('mouseenter', function(e) {
				self.leftHover();
			});
			$("#creativeBack, .rightFace, .rightArrow").bind('mouseenter', function(e) {
				self.rightHover();
			});
		},
		this.faceFold = function(skip) 
		{
			$(".leftArrow").transformString('translate(0px,0px) rotateY(90deg) rotateZ(-15deg) scale(0.96)');
			if (!skip) { 
				$(".leftArrow").transitionDuration('0.6');
				$(".leftArrow").transitionDelay('0.1');
			}
													
			$(".rightArrow").transformString('translate(0px,0px) rotateY(90deg) rotateZ(20deg) scale(0.92)');
			if (!skip) { 
				$(".rightArrow").transitionDuration('1');
				$(".rightArrow").transitionDelay('0');
			}
			
			$(".leftFace").transformString('translate(5px,0px) rotateY(90deg) rotateZ(15deg) scale(1.15)');
			if (!skip) { 
				$(".leftFace").transitionDuration('0.8');
				$(".leftFace").transitionDelay('0.2');
			}
								
			$(".rightFace").transformString('translate(-5px,0px) rotateY(90deg) rotateZ(-10deg) scale(1.11)');
			if (!skip) { 
				$(".rightFace").transitionDuration('0.6');
				$(".rightFace").transitionDelay('0.3');
			}
							
			$(".glasses").transformString('translate(-5px,-18px) rotateY(-90deg) rotateZ(-30deg) scale(1.1)');
			if (!skip) {						
				$(".glasses").transitionDuration('0.5');
				$(".glasses").transitionDelay('0.2');
			}

			$(".mouth").transformString('translate(-7px,-5px) rotateY(-90deg) rotateZ(10deg)');
			if (!skip) {
				$(".mouth").transitionDuration('0.4');
				$(".mouth").transitionDelay('0.4');
			}
			
			$(".leftBack").transformString('translate(0px,0px) rotateY(90deg) rotateZ(-5deg) scale(0.92)');
			$(".leftBack").css('opacity','0.3');
			if (!skip) {
				$(".leftBack").transitionDuration('0.3');
				$(".leftBack").transitionDelay('0.1');
			}
			
			$(".rightBack").transformString('translate(0px,0px) rotateY(90deg) rotateZ(-5deg) scale(0.92)');
			$(".rightBack").css('opacity','0.3');
			if (!skip) {	
				$(".rightBack").transitionDuration('0.3');
				$(".rightBack").transitionDelay('0.1');
			}
		},
		this.backsShake = function(skip)
		{
			$(".leftBack1").css({	'-moz-transform':'rotateZ(5deg)',
									'-moz-transition-duration':'0.9s',
									'-moz-transition-delay':'0.3s'});		
			$(".leftBack2").css({	'-moz-transform':'rotateZ(-2deg)',
									'-moz-transition-duration':'1s',
									'-moz-transition-delay':'0.3s'});		
			$(".leftBack3").css({	'-moz-transform':'rotateZ(2deg)',
									'-moz-transition-duration':'1.2s',
									'-moz-transition-delay':'0.3s'});		
			$(".leftBack4").css({	'-moz-transform':'rotateZ(4deg)',
									'-moz-transition-duration':'0.93s',
									'-moz-transition-delay':'0.3s'});		
			$(".leftBack5").css({	'-moz-transform':'rotateZ(-4deg)',
									'-moz-transition-duration':'0.95s',
									'-moz-transition-delay':'0.3s'});		
			
			$(".rightBack0").css({	'-moz-transform':'rotateZ(-2deg)',
									'-moz-transition-duration':'0.9s',
									'-moz-transition-delay':'0.3s'});		
			$(".rightBack1").css({	'-moz-transform':'rotateZ(-5deg)',
									'-moz-transition-duration':'0.9s',
									'-moz-transition-delay':'0.3s'});		
			$(".rightBack2").css({	'-moz-transform':'rotateZ(-2deg)',
									'-moz-transition-duration':'1s',
									'-moz-transition-delay':'0.3s'});		
			$(".rightBack3").css({	'-moz-transform':'rotateZ(2deg)',
									'-moz-transition-duration':'1.2s',
									'-moz-transition-delay':'0.3s'});		
			$(".rightBack4").css({	'-moz-transform':'rotateZ(-4deg)',
									'-moz-transition-duration':'0.93s',
									'-moz-transition-delay':'0.3s'});		
			$(".rightBack5").css({	'-moz-transform':'rotateZ(-4deg)',
									'-moz-transition-duration':'0.95s',
									'-moz-transition-delay':'0.3s'});		
			$(".rightBack6").css({	'-moz-transform':'rotateZ(2deg)',
									'-moz-transition-duration':'1.2s',
									'-moz-transition-delay':'0.3s'});		
			$(".rightBack7").css({	'-moz-transform':'rotateZ(4deg)',
									'-moz-transition-duration':'0.93s',
									'-moz-transition-delay':'0.3s'});		
			$(".rightBack8").css({	'-moz-transform':'rotateZ(0deg)',
									'-moz-transition-duration':'0.95s',
									'-moz-transition-delay':'0.3s'});		
		},
		this.leftFold = function(skip) 
		{
			var self = this;
			var layout = this.layout;
			self.mirror = "tech";	

			//mixpanel.track("LandingPage-Team");
			
			if (skip) { $(".techHeader").css({'left':"0px"}); }
			else { $(".techHeader").stop().delay(700).animate({'left':"0px"},600); }
			
			if (skip) { $(".creativeHeader").css({'left':layout.browserWidth+"px"}); }
			else { $(".creativeHeader").stop().delay(700).animate({'left':layout.browserWidth+"px"},600);	}
										
			if (skip) { $(".techHeader .navigation, .techHeader .logo").css({'opacity':'1'}); }
			else { $(".techHeader .navigation, .techHeader .logo").stop().delay(1200).animate({'opacity':'1'},600); }
				
			if (skip) { $(".titleHeader").css("top","-100px"); }
			else { $(".titleHeader").stop().delay(400).animate({"top":"-100px"},250);	}		

			if (skip) { $(".landingLogos").css("top","-100px");	}
			else {	$(".landingLogos").stop().animate({"top":"-100px"},250); }
			
			if (skip) {	$(".techFooter").css({"bottom":'-1px'}); }
			else { $(".techFooter").stop().delay(400).animate({"bottom":'-1px'},600); }
			
			if (skip) { $(".techSwitcher").css({'right':'0px'}); }
			else { $(".techSwitcher").stop().delay(1400).animate({'right':'0px'},600);	}
		
			if (skip) { $("#tech").css('left',"0px"); }
			else { $("#tech").stop().delay(900).animate({'left':"0px"},800); } 
			
			if (skip) { $(".creativeHeader .navigation, .creativeHeader .logo").css({'opacity':'1'}); }
			else { $(".creativeHeader .navigation, .creativeHeader .logo").stop().delay(1300).animate({'opacity':'1'}); }
		
			/*
			if(!skip) {
				window.setTimeout(function() {
					$(".leftBack").transformString('translate('+(-layout.columnWidth)*0.75+'px,0px) rotateY(0deg) rotateZ(0deg) scale(1)');
					$(".leftBack").css('opacity','1');
					if (!skip) {	
						$(".leftBack").transitionDuration('0.3');
						$(".leftBack").transitionDelay('0');
					}			
				}, 2000);	
			}
			else {
				$(".leftBack").transformString('translate('+(-layout.columnWidth)*0.75+'px,0px) rotateY(0deg) rotateZ(0deg) scale(1)');
				$(".leftBack").css('opacity','1');			
			}	
			*/			
			
		},	
		this.rightFold = function(skip) 
		{	
			var self = this;
			var layout = this.layout;
			self.mirror = "creative";			
			//mixpanel.track("LandingPage-Creative");	
			
			if (skip) { $(".creativeHeader").css({"left":"0px"}); } 
			else { $(".creativeHeader").stop().delay(700).animate({"left":"0px"},600); }
			
			if (skip) { $(".creativeHeader .navigation, .creativeHeader .logo").css({'opacity':'1'}); }
			else { $(".creativeHeader .navigation, .creativeHeader .logo").stop().delay(1200).animate({'opacity':'1'},600); }
			
			if (skip) { $(".titleHeader").css({"top":"-100px"}); }	
			else { $(".titleHeader").stop().delay(400).animate({"top":"-100px"},250); }
			
			if (skip) { $(".landingLogos").css({"top":"-100px"});	}
			else { $(".landingLogos").stop().animate({"top":"-100px"},250); } 
			
			if (skip) { $(".creativeFooter").css({"bottom":'-1px'}); }
			else {  $(".creativeFooter").stop().delay(400).animate({"bottom":'-1px'},600); }
			
			if (skip) { $(".creativeSwitcher").css({'left':'-1px'}); }
			else { $(".creativeSwitcher").stop().delay(1400).animate({'left':'-1px'},600); }
			
			if (skip) { $("#creative").css('left',"0px"); }
			else { $("#creative").stop().delay(900).animate({'left':"0px"},800); } 
						
			if (skip) { $(".techHeader .navigation, .techHeader .logo").css({'opacity':'1'}); }
			else { $(".techHeader .navigation, .techHeader .logo").stop().delay(1300).animate({'opacity':'1'}); }										
			
			/*
			if(!skip) {
				window.setTimeout(function() {
					$(".rightBack").transformString('translate('+layout.columnWidth*0.75+'px,0px) rotateY(0deg) rotateZ(0deg) scale(1)');
					$(".rightBack").css('opacity','1');
					if (!skip) {	
						$(".rightBack").transitionDuration('0.3');
						$(".rightBack").transitionDelay('0');
					}			
				}, 2000);	
			}
			else {
				$(".rightBack").transformString('translate('+layout.columnWidth*0.75+'px,0px) rotateY(0deg) rotateZ(0deg) scale(1)');
				$(".rightBack").css('opacity','1');			
			}
			*/
		},
		this.mirrorSelection = function() 
		{
			var self = this;
			var layout = this.layout;
			
			$('.switcher').live('click', function(e) 
			{
				e.preventDefault();
				// check the currently displayed mirror (tech/creative)
				if (self.mirror == 'tech')
				{
					//$('#tech .main .video .project .videoObject').css('visibility','hidden');

					// Stop video if playing
					self.stopVideo();
				
					self.mirror = "creative";			
					//self.loadSubpage(false,self.mirror,true);
					
					window.setTimeout(function() { site.layout.setScrollBar(); 	
						
						$(".techHeader").stop().animate({'left':"-"+layout.browserWidth+"px"},600);						
						$(".creativeHeader").stop().animate({"left":"0px"},600);

						$(".techFooter").stop().delay(200).animate({'bottom':"-"+(layout.footerHeight+1)+"px"},600);
						$(".creativeFooter").stop().delay(200).animate({'bottom':"0px"},600);

						$("#tech").stop().delay(200).animate({"left":layout.browserWidth+"px"},900);
						$("#creative").stop().animate({left:"0px"},800);

						$(".techSwitcher").stop().animate({"right":"-"+(layout.switcherWidth+1)+"px"},500);
						$(".creativeSwitcher").stop().delay(500).animate({"left":"-1px"},600);
					}, 40);	

				}
				else 
				// if mirror is creative
				{
					//$('#creative .main .video .project .videoObject').css('visibility','hidden');

					self.stopVideo();
					
					self.mirror = "tech";			
					//self.loadSubpage(false,self.mirror,true);

					window.setTimeout(function() { site.layout.setScrollBar(); 	
						$(".creativeHeader").stop().animate({'left':layout.browserWidth+"px"},600);						
						$(".techHeader").stop().animate({"left":"0px"},600);

						$(".creativeFooter").stop().delay(200).animate({'bottom':"-"+(layout.footerHeight+1)+"px"},600);
						$(".techFooter").stop().delay(200).animate({'bottom':"0px"},600);

						$("#creative").stop().delay(20).animate({"left":"-"+layout.browserWidth+"px"},900);
						$("#tech").stop().animate({left:"0px"},800);

						$(".creativeSwitcher").stop().animate({"left":"-"+(layout.switcherWidth+1)+"px"},500);
						$(".techSwitcher").stop().delay(500).animate({"right":"-1px"},600);
					}, 40);	
					
				}
			});
		},
		this.rightHover = function() 
		{
			var layout = this.layout;

			$(".rightArrow").stop().animate({"left":"50px"},250);
			$(".leftArrow").stop().animate({"left":"-622px"},350);	

			$(".titleHeader").stop().animate({"left":"0px"},250);	
			$(".titleHeader span").stop().animate({"left":(layout.browserWidth/2)-(layout.padding*2)-$(".titleHeader span").width()+"px"},250);	
										
			$(".rightFace").transformString('translate(0px,0px) rotateY(0deg) rotateZ(0deg)');
			$(".rightFace").transitionDuration('0.27');
			$(".rightFace").transitionDelay('0');
			
			$(".leftFace").transformString('translate(0px,0px) rotateY(20deg) rotateZ(0deg)');
			$(".leftFace").transitionDuration('0.3');
			$(".leftFace").transitionDelay('0');
		
			$(".glasses,.mouth").transformString('translate(1px,0px) rotateY(4deg) rotateZ(-1deg)');
			$(".glasses,.mouth").transitionDuration('0.3');
			$(".glasses,.mouth").transitionDelay('0');

			$(".leftBack").transformString('translate(0px,0px) rotateY(10deg) rotateZ(3deg) scale(0.96)');
			$(".leftBack").css('opacity','0.4');
			$(".leftBack").transitionDuration('0.3');
			$(".leftBack").transitionDelay('0');

			$(".rightBack").transformString('translate(0px,0px) rotateY(0deg) scale(1)');
			$(".rightBack").css('opacity','0.5');
			$(".rightBack").transitionDuration('0.3');
			$(".rightBack").transitionDelay('0');
		},		
		this.leftHover = function() 
		{
			var layout = this.layout;

			$(".rightArrow").stop().animate({"left":"0px"},350);		
			$(".leftArrow").stop().animate({"left":"-672px"},250);		

			$(".titleHeader").stop().animate({"left":layout.browserWidth/2+"px"},250);	
			$(".titleHeader span").stop().animate({"left":layout.padding+"px"},250);	

			$(".leftFace").transformString('translate(0px,0px) rotateY(0deg) rotateZ(0deg)');
			$(".leftFace").transitionDuration('0.27');
			$(".leftFace").transitionDelay('0');
			
			$(".rightFace").transformString('translate(0px,0px) rotateY(20deg) rotateZ(0deg)');
			$(".rightFace").transitionDuration('0.3');
			$(".rightFace").transitionDelay('0');

			$(".glasses,.mouth").transformString('translate(2px,0px) rotateY(-2deg) rotateZ(0.5deg)');
			$(".glasses,.mouth").transitionDuration('0.3');
			$(".glasses,.mouth").transitionDelay('0');
	
			$(".leftBack").transformString('translate(0px,0px) rotateY(0deg) scale(1)');
			$(".leftBack").css('opacity','0.5');
			$(".leftBack").transitionDuration('0.3');
			$(".leftBack").transitionDelay('0');

			$(".rightBack").transformString('translate(0px,0px) rotateY(10deg) rotateZ(-3deg) scale(0.96)');
			$(".rightBack").css('opacity','0.4');
			$(".rightBack").transitionDuration('0.3');
			$(".rightBack").transitionDelay('0');
			
		},
		this.shadowbox = function()
		{
			var self = this;
			Shadowbox.init();
		};
	};
})(jQuery);