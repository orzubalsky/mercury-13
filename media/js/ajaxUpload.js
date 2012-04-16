;(function($){
	var ajaxUpload = window.site.ajaxUpload = new function() {
		this.swfu;
		this.init = function() {
			this.debug();
			this.ajaxUpload();
		},
		this.debug = function() {
			//
		},
		this.ajaxUpload = function() 
		{
			var self = this;
			
			$('#swf-upload').swfupload({
				upload_url: "http://localhost:8888/ff/ajax/user/ajaxupload",
		    	post_params : { 'SESSID' : self.getSessionId(), 'other':'1234'},  
				file_post_name: 'file',
				file_size_limit : "10MB",
				file_types : "*.mp3",
				file_types_description : "files",
				file_upload_limit : 1,
				flash_url : baseUrl + "/js/swfupload/swfupload.swf",
				button_image_url : baseUrl + '/js/swfupload/choose_arrow2.png',
				button_width : 99,
				button_height : 99,
				button_placeholder : $('#button')[0],
				debug: false,
				debug_enabled: false,
	            use_query_string : true
			})
			.bind('fileQueued', function(event, file)
			{
				$('#arrowPlaceholder').removeClass().addClass('progress').show();
				$('.progressBarContainer').show();
				$('#uploadText').removeClass().addClass('progress').text(file.name);
				
				
				/*
				var listitem='<li id="'+file.id+'" >'+
					'File: <em>'+file.name+'</em> ('+Math.round(file.size/1024)+' KB) <span class="progressvalue" ></span>'+
					'<div class="progressbar" ><div class="progress" ></div></div>'+
					'<p class="status" >Pending</p>'+
					'<span class="cancel" >&nbsp;</span>'+
					'</li>';
				$('#log').append(listitem);
				$('li#'+file.id+' .cancel').bind('click', function(){ //Remove from queue on cancel click
					var swfu = $.swfupload.getInstance('#swfupload-control');
					swfu.cancelUpload(file.id);
					$('li#'+file.id).slideUp('fast');
				});
				*/
				
				// start the upload since it's queued
				$(this).swfupload('startUpload');
			})
			.bind('fileQueueError', function(event, file, errorCode, message){
				//alert('Size of the file '+file.name+' is greater than limit');
			})
			.bind('fileDialogComplete', function(event, numFilesSelected, numFilesQueued){
				//$('#queuestatus').text('Files Selected: '+numFilesSelected+' / Queued Files: '+numFilesQueued);
			})
			.bind('uploadStart', function(event, file){
				//$('#log li#'+file.id).find('p.status').text('Uploading...');
				//$('#log li#'+file.id).find('span.progressvalue').text('0%');
				//$('#log li#'+file.id).find('span.cancel').hide();
			})
			.bind('uploadProgress', function(event, file, bytesLoaded){
				//Show Progress
				var percentage=Math.round((bytesLoaded/file.size)*100);
				$('.progressBarContainer .progress').css({'width':percentage+'%'});
				
				//$('#log li#'+file.id).find('div.progress').css('width', percentage+'%');
				//$('#log li#'+file.id).find('span.progressvalue').text(percentage+'%');
			})
			.bind('uploadSuccess', function(event, file, serverData)
			{
				$('li#upload').removeClass().addClass('complete');
				$('.progressBarContainer').hide();
				$('#arrowPlaceholder').removeClass().addClass('complete').show();
	
				
				
				
				//var item=$('#log li#'+file.id);
				//item.find('div.progress').css('width', '100%');
				//item.find('span.progressvalue').text('100%');
				//var pathtofile='<a href="uploads/'+file.name+'" target="_blank" >view &raquo;</a>';
				//item.addClass('success').find('p.status').html('Done!!! | '+pathtofile);
				
				var data = $.parseJSON( serverData )
				//console.log(data);
				$('#filename').val(data.filename);
				$('#filename_original').val(file.name);
			})
			.bind('uploadComplete', function(event, file){
				// upload has completed, try the next one in the queue
				$(this).swfupload('startUpload');
			})
			.bind('uploadError', function(event, message) {
			});
		},
		this.getSessionId = function() {
			var ca = document.cookie.split(';');
			var sessid = '';
			for(var i in ca){
				var c = ca[i].split('=');
				if(typeof(c[0]) != 'undefined' && c[0].indexOf('PHPSESSID') != -1) {
					sessid = c[1];	
				}
			}
			return sessid;
		};		
	};
})(jQuery);

$(document).ready(function(){
	site.ajaxUpload.init();
});		