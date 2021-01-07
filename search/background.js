var	default_list = [
	{name: "Google",url: "https://www.google.com/search?q="	 }
	,{name: "Yahoo",url: "https://search.yahoo.com/search?p="}
];

function setting(info, tab) {
    return function (info, tab) {
        var selection = info.selectionText;
        var url = "options.html";
        chrome.tabs.create({
            index: tab.index + 1,
            url: url,
            selected: true
        });
    }
}

function search(data ,info, tab) {
    return function (info, tab) {	
        var selection = info.selectionText;
       // var url = info.pageUrl + selection;
		var url = data + selection;
        chrome.tabs.create({
            index: tab.index + 1,
            url: url,
            selected: true
        });
    }
}

function updatemenu(){
	
	chrome.contextMenus.removeAll();
	
	chrome.contextMenus.create({
		"id": "Search",
		title: "Search",
		contexts: ["all"],
		id: "parent"
	});
	
		
	chrome.storage.sync.get({
		url_list: true
	}, function(items) {
		
		var urls = items.url_list;		
		for (i = 0; i < urls.length; i++) {
			chrome.contextMenus.create({
				"title": urls[i].name,
				"type": "normal",
				"contexts": ["selection"],
				"onclick": search(urls[i].url),
				parentId: "parent"
			});									
		}
		
		chrome.contextMenus.create({
			type: "separator",
			contexts: ['selection'],
			parentId: "parent"
		});				

		chrome.contextMenus.create({
			"id": "Setting",
			"title": "Setting",
			"type": "normal",
			"contexts": ["all"],
			"onclick": setting(),
			parentId: "parent"
		});
		
	})	
	
}

function handleInstalled(details) {	
	//console.log(details);
	chrome.storage.sync.set(
		{'url_list': default_list ,'value': true },
		function() {updatemenu();}
	);
}

updatemenu();
chrome.runtime.onInstalled.addListener(handleInstalled);







