
function replaceAllBackSlash(targetStr){
      var index=targetStr.indexOf("\\");
      while(index >= 0){
          targetStr=targetStr.replace("\\","");
          index=targetStr.indexOf("\\");
      }
      return targetStr;
  }
  //^stolen
 function getElementVideo(){
	console.debug(document);
	
	// First try to find HTML5 video elements (modern approach)
	var videos = document.querySelectorAll('video');
	if(videos && videos.length > 0) {
		console.debug("Found " + videos.length + " HTML5 video elements");
		return videos[0]; // Return the first video element found
	}
	
	// Fallback to old Flash embed detection for backward compatibility
	var swf = document.embeds;
	if(swf == null){ return null; }
	for(var i = 0; i < swf.length; i++)
	{
		if(swf[i].attributes.length == 15)
		{
			return swf[i];
		
		}	
	}
	return null;
 }
 
 function RetrieveVideoData(videoElement){
	// Handle HTML5 video elements
	if(videoElement.tagName && videoElement.tagName.toLowerCase() === 'video') {
		var videoData = "";
		
		// Check for direct src attribute
		if(videoElement.src) {
			videoData += videoElement.src + " ";
		}
		
		// Check for source elements
		var sources = videoElement.querySelectorAll('source');
		for(var i = 0; i < sources.length; i++) {
			if(sources[i].src) {
				videoData += sources[i].src + " ";
			}
		}
		
		// Check for data attributes that might contain video URLs
		var dataAttrs = ['data-src', 'data-video-url', 'data-stream-url', 'data-hd-src'];
		for(var j = 0; j < dataAttrs.length; j++) {
			var attrValue = videoElement.getAttribute(dataAttrs[j]);
			if(attrValue) {
				videoData += attrValue + " ";
			}
		}
		
		// Try to find video URLs in the page's script tags and JSON data
		videoData += extractVideoURLsFromScripts();
		
		console.debug("Extracted video data from HTML5 video element");
		return videoData;
	}
	
	// Handle Flash embeds (legacy support)
	if(videoElement.attributes && videoElement.attributes["flashvars"]) {
		var swfText = videoElement.attributes["flashvars"].textContent;
		swfText = decodeURIComponent(swfText);
		console.debug("Extracted video data from Flash embed");
		return swfText;
	}
	
	return "";
 }

 function extractVideoURLsFromScripts() {
	var scriptData = "";
	var scripts = document.querySelectorAll('script');
	
	for(var i = 0; i < scripts.length; i++) {
		var scriptContent = scripts[i].innerHTML;
		if(scriptContent && (scriptContent.includes('.mp4') || 
							scriptContent.includes('.webm') || 
							scriptContent.includes('video_url') ||
							scriptContent.includes('playable_url') ||
							scriptContent.includes('browser_native_'))) {
			scriptData += scriptContent + " ";
		}
	}
	
	// Also check for video data in common Facebook patterns
	var fbVideoData = document.querySelector('[data-store*="video"]');
	if(fbVideoData) {
		scriptData += fbVideoData.getAttribute('data-store') + " ";
	}
	
	// Look for JSON-LD structured data
	var jsonLdElements = document.querySelectorAll('script[type="application/ld+json"]');
	for(var j = 0; j < jsonLdElements.length; j++) {
		var jsonContent = jsonLdElements[j].innerHTML;
		if(jsonContent && jsonContent.includes('video')) {
			scriptData += jsonContent + " ";
		}
	}
	
	return scriptData;
 }
 
 function RetrieveURLS(videoData){
	var vidUrls = []
	
	// Enhanced regex to catch more video URL patterns, including Facebook's specific patterns
	var urlPatterns = [
		/(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
		/"(https?:\/\/[^"]*\.(mp4|webm|mov|avi|m4v)[^"]*)"/ig,
		/'(https?:\/\/[^']*\.(mp4|webm|mov|avi|m4v)[^']*)'/ig,
		/"playable_url[^"]*":"([^"]+)"/ig,
		/"browser_native_[^"]*":"([^"]+)"/ig
	];
	
	var allUrls = [];
	
	for(var p = 0; p < urlPatterns.length; p++) {
		var matches = videoData.match(urlPatterns[p]);
		if(matches) {
			allUrls = allUrls.concat(matches);
		}
	}
	
	if(allUrls.length === 0) {
		console.debug("No URLs found in video data");
		return vidUrls;
	}
	
	console.debug("Found " + allUrls.length + " total URLs");
	
	for(var i = 0; i < allUrls.length; i++)
	{
		var url = allUrls[i];
		
		// Clean up the URL - remove quotes and extract the actual URL
		url = url.replace(/^["']|["']$/g, '');
		if(url.includes('":"')) {
			url = url.split('":"')[1];
		}
		
		// Decode escaped characters
		url = url.replace(/\\u002F/g, '/');
		url = url.replace(/\\u0026/g, '&');
		url = url.replace(/\\\//g, '/');
		
		// Check for various video formats
		if(url.indexOf("mp4") != -1 || 
		   url.indexOf("webm") != -1 || 
		   url.indexOf("mov") != -1 ||
		   url.indexOf("avi") != -1 ||
		   url.indexOf("m4v") != -1 ||
		   url.indexOf("video") != -1) {
			
			// Clean up the URL - remove trailing characters that might not be part of the URL
			url = url.replace(/[",;}\]\\]+$/, '');
			
			// Ensure it's a valid URL
			if(url.startsWith('http')) {
				// Avoid duplicates
				if(vidUrls.indexOf(url) === -1) {
					vidUrls.push(url);
				}
			}
		}
	}
	
	console.debug(vidUrls.length + "/" + allUrls.length + " URLs are videos"); 
	return vidUrls;
 }
 
 window.downloadFile = function (sUrl) {

    //iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
        alert('Your device does not support files downloading. Please try again in desktop browser.');
        return false;
    }

    //If in Chrome or Safari - download via virtual link click
    
        //Creating new link node.
        var link = document.createElement('a');
        link.href = sUrl;

        if (link.download !== undefined) {
            //Set HTML5 download attribute. This will prevent file from opening if supported.
            var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.lastIndexOf('?'));
            link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
            var e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
            return true;
        }
    

    // Force file download (whether supported by server).
    sUrl += '?download';

    window.open(sUrl, '_self');
    return true;
}

function Work()
{
	var VideoElement = getElementVideo();
	if(VideoElement == null){ 
		console.debug("No Video Elements found"); 
		alert("No video elements found on this page. Make sure you're on a Facebook page with a video.");
		return;
	} 
	else
	{
		console.debug("Found video element:", VideoElement);
		
		var VideoData = RetrieveVideoData(VideoElement);
		VideoData = replaceAllBackSlash(VideoData);
		var VideoURL = RetrieveURLS(VideoData);

		if(VideoURL.length === 0) {
			console.debug("No video URLs found");
			alert("No downloadable video URLs found. The video might use a streaming format that's not supported.");
			return;
		}

		console.debug("Found " + VideoURL.length + " video URLs");
		
		for(var i = 0; i < VideoURL.length; i++)
		{
			console.debug("Attempting to download:", VideoURL[i]);
			window.downloadFile(VideoURL[i]);
		}
		
		alert("Initiated download of " + VideoURL.length + " video(s). Check your browser's download manager.");
	}
}

Work();