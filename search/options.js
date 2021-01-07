var list = [];
var cDeleteRow;

function reload_url(){
	//console.log("reload");
	var table = document.getElementById("table");
	for (var i = table.rows.length - 1; i > 0; i-- ){
		table.deleteRow(i);
	}
	load_url();
}

function save_url(){
	//console.log("save");
	var empty = false;
	var table = document.getElementById("table");
	var tList = [];

	for (var i = 1; i < table.rows.length; i++) {	
		var row = table.rows[i];	
		var name = row.getElementsByClassName("input_name")[0].value;
		var url = row.getElementsByClassName("input_url")[0].value;
		
		tList.push({
			name: name,
			url: url
		})
		
		if( name.trim() == '' || url.trim() == '' ){	
			empty = true;
			if( name.trim() == '' ) row.getElementsByClassName("input_name")[0].style.border="2px solid red";
			if( url.trim() == '' ) row.getElementsByClassName("input_url")[0].style.border="2px solid red";			
		}
		if( name.trim() != '' )	row.getElementsByClassName("input_name")[0].style.border="1px solid black";
		if( url.trim() != '' ) row.getElementsByClassName("input_url")[0].style.border="1px solid black";		
	}		
	
	if(empty){
		alert_show("Error","Please input both name and url !");
	}else{	
		chrome.storage.sync.set({
			url_list: tList
		}, function() {
			chrome.extension.getBackgroundPage().updatemenu();
			//console.log("List saved , list = " + JSON.stringify(list));
			info_show("Message","The name and url have been saved");
		});			
		//console.log(list);		
	}	
}
	   
function remove_row(event , cRow){
	//console.log("remove_row");
	if( table.rows.length > 2){	
		cDeleteRow = cRow;
		confirm_show("Warming","Are you sure to delete ?");		
	}else{
		alert_show("Warming","The last row cannot be removed !");
	}	
}

function up_row(event , cRow){
	//console.log("up_row");				
	var table = document.getElementById("table");
	var rows = table.rows;		
	cIndex = cRow.rowIndex;
	if( cIndex > 1 && rows[cIndex] !== undefined && rows[cIndex-1] !== undefined){
		 table.insertBefore(rows[cIndex],rows[cIndex - 1]);
	}			
}

function down_row(event , cRow){
	//console.log("down_row");
	var table = document.getElementById("table");
	var rows = table.rows;		
	cIndex = cRow.rowIndex;
	if( rows[cIndex+1] !== undefined && rows[cIndex] !== undefined){
		table.insertBefore(rows[cIndex+1],rows[cIndex]);
	}								
}

function add_row(event, cRow , url_name , url_value ) {
	//console.log("add_row");
	
	var table = document.getElementById("table");
	
	var row = document.createElement("tr");
	row.setAttribute("draggable", "true");
	row.setAttribute("class", "row");
	row.addEventListener('dragstart', row_start );	
	row.addEventListener('dragover', row_dragover);	
	
	var cell_name = document.createElement("td");
	cell_name.setAttribute("class", "cell");
	row.appendChild(cell_name);

	var cell_url = document.createElement("td");
	cell_url.setAttribute("class", "cell");
	row.appendChild(cell_url);

	var input_name = document.createElement("input");
	input_name.setAttribute("type", "text");
	input_name.setAttribute("class", "input_name");
	input_name.setAttribute("value", url_name);
	input_name.addEventListener('change', input_change.bind(null,event,cell_name,input_name ) );
	cell_name.appendChild(input_name);

	var input_url = document.createElement("input");
	input_url.setAttribute("type", "text");
	input_url.setAttribute("class", "input_url");
	input_url.setAttribute("value", url_value);
	input_url.addEventListener('change', input_change.bind(null,event,cell_url,input_url) );
	cell_url.appendChild(input_url);
	
	var cell_action = document.createElement("td");
	cell_action.setAttribute("nowrap", "true");
	cell_action.setAttribute("class", "cell");
	row.appendChild(cell_action);

	var buttom_add = document.createElement("input");
	buttom_add.innerHTML = "Add";
	buttom_add.setAttribute("class", "button button_add");
	buttom_add.setAttribute("type", "image");
	buttom_add.setAttribute("src", "add.png");
	//buttom_add.setAttribute("onClick", "add_row(this,'','')");
	buttom_add.addEventListener('click', add_row.bind(null,event,row,'','') );
	cell_action.appendChild(buttom_add);
								
	var label = document.createElement("label");
	label.innerHTML = "&nbsp;&nbsp;&nbsp;";
	cell_action.appendChild(label);
				
	var buttom_remove = document.createElement("input");
	buttom_remove.innerHTML = "Remove";
	buttom_remove.setAttribute("class", "button button_remove");
	buttom_remove.setAttribute("type", "image");
	buttom_remove.setAttribute("src", "remove.png");
	//buttom_remove.setAttribute("onClick", "remove_row(this)");
	buttom_remove.addEventListener('click', remove_row.bind(null,event,row) );	
	cell_action.appendChild(buttom_remove);		
					
	var label = document.createElement("label");
	label.innerHTML = "&nbsp;&nbsp;&nbsp;";
	cell_action.appendChild(label);
				
	var buttom_up = document.createElement("input");
	buttom_up.innerHTML = "Up";
	buttom_up.setAttribute("class", "button button_up");
	buttom_up.setAttribute("type", "image");
	buttom_up.setAttribute("src", "up.png");
	buttom_up.addEventListener('click', up_row.bind(null,event,row) );	
	//buttom_up.setAttribute("onClick", "up_row(this)");
	cell_action.appendChild(buttom_up);		
				
	var label = document.createElement("label");
	label.innerHTML = "&nbsp;&nbsp;&nbsp;";
	cell_action.appendChild(label);
				
	var buttom_down = document.createElement("input");
	buttom_down.innerHTML = "Down";
	buttom_down.setAttribute("class", "button button_down");
	buttom_down.setAttribute("type", "image");
	buttom_down.setAttribute("src", "down.png");			
	//buttom_down.setAttribute("onClick", "down_row(this)");
	buttom_down.addEventListener('click', down_row.bind(null,event,row) );	
	cell_action.appendChild(buttom_down);						
	
	if(cRow != ''){								
		table.insertBefore(row,cRow.nextSibling);						
	}else{
		table.appendChild(row);				
	}
	
}						

function load_url() {
	//console.log("load");
    chrome.storage.sync.get({
        url_list: true
    }, function(items) {        
		var url_list = items.url_list;
		for (i = 0; i < url_list.length; i++) {
			add_row('' , '' , url_list[i].name , url_list[i].url );
		}	
    })
}

function popup_close(){
	document.getElementById("popup_box").style.display = "none";
	document.getElementById("overlay").style.display = "none";	
}

function alert_show(header,message){
	document.getElementById("popup_box").style.display = "block";
	document.getElementById("overlay").style.display = "block";
	document.getElementById("popup_header").innerHTML = header;
	document.getElementById("popup_message").innerHTML = message;
	document.getElementById("button_yes").style.display = "none";
	document.getElementById("button_no").style.display = "none";
	document.getElementById("button_close").style.display = "";	
	document.getElementById("image_error").style.display = "";
	document.getElementById("image_info").style.display = "none";	
	document.getElementById("image_confirm").style.display = "none";
	document.getElementById("popup_box").style.top = "50%";
	document.getElementById("popup_box").style.left = "50%";	
}

function confirm_show(header,message){
	document.getElementById("popup_message").innerHTML = message;	
	document.getElementById("popup_box").style.display = "block";
	document.getElementById("overlay").style.display = "block";
	document.getElementById("popup_header").innerHTML = header;
	document.getElementById("button_yes").style.display = "";
	document.getElementById("button_no").style.display = "";
	document.getElementById("button_close").style.display = "none";	
	document.getElementById("image_error").style.display = "none";
	document.getElementById("image_info").style.display = "none";	
	document.getElementById("image_confirm").style.display = "";
	document.getElementById("popup_box").style.top = "50%";
	document.getElementById("popup_box").style.left = "50%"; 	
}

function info_show(header,message){
	document.getElementById("popup_message").innerHTML = message;	
	document.getElementById("popup_box").style.display = "block";
	document.getElementById("overlay").style.display = "block";
	document.getElementById("popup_header").innerHTML = header;
	document.getElementById("button_yes").style.display = "none";
	document.getElementById("button_no").style.display = "none";
	document.getElementById("button_close").style.display = "";	
	document.getElementById("image_error").style.display = "none";
	document.getElementById("image_info").style.display = "";	
	document.getElementById("image_confirm").style.display = "none";
	document.getElementById("popup_box").style.top = "50%";
	document.getElementById("popup_box").style.left = "50%"; 
				
}

function confirm_yes(){
	//console.log("confirm_yes");
	var table = document.getElementById("table");
	if( table.rows.length > 2){
		cDeleteRow.remove();
		document.getElementById("popup_box").style.display = "none";
		document.getElementById("overlay").style.display = "none";		
	}else{
		alert_show("Warming","The last row cannot be removed !");
	}	
}

function confirm_no(){
	//console.log("confirm_no");
	document.getElementById("popup_box").style.display = "none";
	document.getElementById("overlay").style.display = "none";
}


var rowDrag;

function row_start(){ 
	//console.log("row_start");		
	rowDrag = event.target;	
}

function row_dragover(){
	//console.log("row_dragover");
	var e = event;
	e.preventDefault(); 
	var sRow = (rowDrag.tagName == "TD")? rowDrag.parentNode:rowDrag;
	var sTarget;
	
	if (e.touches === undefined ) {
		sTarget = e.target.parentNode;				
	}else{
		var target = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
		sTarget = (target.tagName == "TR") ? target:target.parentNode;			
	}
	
	if(sTarget.tagName == "TR" ){	
		let children =  Array.from(e.target.parentNode.parentNode.children);
		if(children.indexOf(e.target.parentNode)>children.indexOf(sRow)){
			sTarget.after(sRow);	
		}else{
			sTarget.before(sRow);
		}			
	}	
}


function input_change(event, cCell ,cInput ){
	if( cInput.value.trim() != '' )cInput.style.border="1px solid black";	
}


dragElement(document.getElementById("popup_box"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
	document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
	elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
	e = e || window.event;
	e.preventDefault();
	pos3 = e.clientX;
	pos4 = e.clientY;
	document.onmouseup = closeDragElement;
	document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
	e = e || window.event;
	e.preventDefault();
	pos1 = pos3 - e.clientX;
	pos2 = pos4 - e.clientY;
	pos3 = e.clientX;
	pos4 = e.clientY;
	var popup = document.getElementById("popup_box");
	var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
	
	if( (elmnt.offsetTop - pos2)  > popup.clientHeight/2 
		&& (elmnt.offsetLeft - pos1)  > popup.clientWidth/2 
		&& vh > ( elmnt.offsetTop + popup.clientHeight/2  - pos2 )
		&& vw > ( elmnt.offsetLeft + popup.clientWidth/2  - pos1 )
		){	
		elmnt.style.top  = (elmnt.offsetTop  - pos2 ) + "px";
		elmnt.style.left  = (elmnt.offsetLeft - pos1 ) + "px";	
	}
  }

  function closeDragElement() {
	document.onmouseup = null;
	document.onmousemove = null;
  }
}
/*
function touchHandler(event) {
	var touch = event.changedTouches[0];

	var simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent({
		touchstart: "mousedown",
		touchmove: "mousemove",
		touchend: "mouseup"
	}[event.type], true, true, window, 1,
		touch.screenX, touch.screenY,
		touch.clientX, touch.clientY, false,
		false, false, false, 0, null);

	touch.target.dispatchEvent(simulatedEvent);
	event.preventDefault();
}
*/
//document.addEventListener("touchstart", touchHandler,  { passive: false });
//document.addEventListener("touchmove", touchHandler,  { passive: false });
//document.addEventListener("touchend", touchHandler,  { passive: false });
//document.addEventListener("touchcancel", touchHandler,  { passive: false });	


document.addEventListener('DOMContentLoaded', load_url);
document.getElementById('save_url').addEventListener('click', save_url);
document.getElementById('reload_url').addEventListener('click', reload_url);
document.getElementById('button_close').addEventListener('click', popup_close);
document.getElementById('button_yes').addEventListener('click', confirm_yes);
document.getElementById('button_no').addEventListener('click', confirm_no);

