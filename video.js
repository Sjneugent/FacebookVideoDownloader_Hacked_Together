
//Begin Main
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript(
			{file: "fb.js"}, function(){
				if(chrome.runtime.lastError){
					console.error(chrome.runtime.lastError.message);
				}
			});
	});

