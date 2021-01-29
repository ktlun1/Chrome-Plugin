var style = ".div_hover { background-color: #FFFFFF;  }  .div_hover:hover { background-color: #DCDCDC;  } ;"

var styleDom = document.createElement("style");
styleDom.setAttribute("type", "text/css");
document.head.appendChild(styleDom);
styleDom.innerHTML = style;

var button = document.createElement("button");
button.setAttribute("id", "downloadBtn");
button.textContent = " Download ▼ ";
button.style = "background-color: green ;color : white; height : 40px  ; margin: 10px; border: none; ";

var c = setInterval(function () {
	if (document.querySelector("ytd-video-owner-renderer") ||
	  document.getElementById("watch7-action-buttons") ||
	  document.getElementById("watch8-secondary-actions") ||
	  document.getElementById("ytm-item-section-renderer>lazy-list") ||
	  document.querySelector("ytm-slim-owner-renderer")
	) {
	  clearInterval(c);

	 var referenceNode = document.querySelector("ytd-video-owner-renderer")
	 referenceNode.parentNode.insertBefore(button, referenceNode.nextSibling);

	}
}, 10);

var menu = document.createElement("div");
menu.setAttribute("id", "menu");
menu.style = "border :1px solid black ; position :absolute  ; background :white ; display :none ; z-index :1 ";
document.body.appendChild(menu);

document.addEventListener("click", function (e) {
	var t = e.target;
	if(t.id != "downloadBtn" || t.id != "menu" ){
		menu.style.display = "none";
	}
});

button.addEventListener("click", function (){
	var videoid = new URLSearchParams(window.location.search).get("v");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function (){
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			
			let position = offset(button);
			menu.style.top = position.top + button.offsetHeight + 5 + "px";
			menu.style.left = position.left - (menu.offsetWidth - button.offsetWidth) / 2 + "px";
			menu.style.display = "block";
			menu.innerHTML = ""			
			
			var responseText = xmlHttp.responseText;
			var playerResponse = new URLSearchParams(responseText).get("player_response");
			var playerResponseJson = JSON.parse(playerResponse);
			var streamingData = playerResponseJson["streamingData"]

			var formats = streamingData["formats"];
			for (item of formats) {
				addItem(item);
			}

			var adaptiveFormats = streamingData["adaptiveFormats"];
			for (adaptiveFormat of adaptiveFormats) {
				//console.log(">>>> URL(adaptiveFormats) = " + adaptiveFormat.url );
				//addItem(adaptiveFormat);
			}

		}
	}
	xmlHttp.open("GET", "https://www.youtube.com/get_video_info?video_id=" + videoid + "&el=detailpage", true)
	xmlHttp.send()
	//window.open("/get_video_info?video_id=" + videoid, "_blank")
})


function addItem(link) {
	  const anchor = document.createElement('a');
	  //var url = new URL(link.url);
	  //anchor.href = url.pathname + url.search;
	  anchor.href = link.url
	  anchor.innerText = link.quality + " ("+bytesToSize(link.contentLength) +") ";
	  anchor.setAttribute("target","_blank");
	  anchor.setAttribute("download","");
	  //anchor.setAttribute("type","application/octet-stream");
	  anchor.style = "text-decoration: none; font-size: 15px"
	  const iDiv = document.createElement('div');
	  iDiv.style = "min-width :100px; text-align:left ;  padding-top: 10px; padding-bottom: 10px;  padding-left: 5px; padding-right: 5px;"
	  iDiv.setAttribute("class","div_hover");
	  iDiv.appendChild(anchor);
	  menu.appendChild(iDiv);
}

function offset(el) {
  var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: el.getBoundingClientRect().top + scrollTop,
    left: el.getBoundingClientRect().left + scrollLeft,
  };
}

function bytesToSize(bytes){
	if(isNaN(bytes)){
		return 'N/A';
	}else{
	   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	   if (bytes == 0) return '0 Byte';
	   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	}
}

