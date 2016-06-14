
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
 
 function RetrieveFlashParams(swfEmbedded){
	var swfText = swfEmbedded.attributes["flashvars"].textContent;
	swfText = decodeURIComponent(swfText);
 
	return swfText;
 }
 
 function RetrieveURLS(flashVars){
	var vidUrls = []
	var urls = flashVars.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig); //"borrowed regex"
	for(var i = 0; i <  urls.length; i++)
	{
		
		if(urls[i].indexOf("mp4") != -1)
		{
			vidUrls.push(urls[i]);
		}
	}
	console.debug(vidUrls.length +"/"+ urls.length + " Urls are videos"); 
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
	if(VideoElement == null){ console.debug("No Video Elements found"); } 
	else
	{
		var FlashParams = RetrieveFlashParams(VideoElement);
		FlashParams = replaceAllBackSlash(FlashParams);
		var VideoURL = RetrieveURLS(FlashParams);

		for(var i = 0; i < VideoURL.length; i++)
		{
			downloadFile(VideoURL[i]);
			console.debug(VideoURL[i]);
		}
	}
}

Work();