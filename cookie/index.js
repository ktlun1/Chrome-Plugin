const chkAllDomain = document.getElementById("chkAllDomain");
const tableDomain = document.getElementById("tableDomains");

function clearDetail(){
	document.getElementById("domain").value = "";
	document.getElementById("name").value = "";
	document.getElementById("value").value = "";
	document.getElementById("hostOnly").checked = false;
	document.getElementById("httpOnly").checked = false;
	document.getElementById("value").value = "";	
	document.getElementById("path").value = "";
	document.getElementById("secure").checked = false;
	document.getElementById("session").checked = false;	
	document.getElementById("expireDate").value = "";
	document.getElementById("expireTime").value = "";	
}

function loadDetail(evt , eDomain , eName){
	var domainCookies = [];
	chrome.cookies.getAll({
		domain : eDomain 
	}, function (cookies){
		for (var i = 0 ; i < cookies.length ; i++) {
			if(cookies[i].domain.trim() == eDomain.trim() && cookies[i].name.trim() == eName.trim() ){
				if(cookies[i].expirationDate !== undefined){
					var cookieDate = new Date(cookies[i].expirationDate );	
					var pDate = cookieDate.toISOString().slice(0,10);
					var pTime =("0" + cookieDate.getHours()).slice(-2)   + ":" + 
								("0" + cookieDate.getMinutes()).slice(-2) + ":" + 
								("0" + cookieDate.getSeconds()).slice(-2);
					document.getElementById("expireDate").value = pDate;
					document.getElementById("expireTime").value = pTime;							
				}			
				document.getElementById("domain").value = cookies[i].domain;
				document.getElementById("name").value = cookies[i].name;
				document.getElementById("value").value = cookies[i].value;	
				document.getElementById("hostOnly").checked = cookies[i].hostOnly;
				document.getElementById("httpOnly").checked = cookies[i].httpOnly;
				document.getElementById("value").value = cookies[i].value;	
				document.getElementById("path").value = cookies[i].path;
				document.getElementById("secure").checked = cookies[i].secure;
				document.getElementById("session").checked = cookies[i].session;	
		
				/*
				{domain: ".360yield.com", expirationDate: 1614293134.675275, hostOnly: false, httpOnly: false, name: "tuuid", …}
				domain: ".360yield.com"
				expirationDate: 1614293134.675275
				hostOnly: false
				httpOnly: false
				name: "tuuid"
				path: "/"
				sameSite: "no_restriction"
				secure: true
				session: false
				storeId: "0"
				value: "a0a069a2-b129-45ad-8bcb-d9ab89174803"
				__proto__: Object
				
				*/
			}
		}	
	});
}

function doChkAllDomain(evt , domain){
	var rows = tableDomain.rows;
	for(var i = 0 ; i < rows.length ; i++){				
		var chk = rows[i].cells[0].children[0];
		chk.checked = chkAllDomain.checked;
		if ("createEvent" in document){
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent("change" , false , true);
			chk.dispatchEvent(evt);
		} else {
			chk.fireEvent("onchange");
		}			
	}
}
		
function search(){
	var search = document.getElementById('search').value;
	getDomain(search);
}
	
function create(){	

	var domain = document.getElementById("domain").value;
	var name = document.getElementById("name").value;
	var value  = document.getElementById("value").value;
	var value  = document.getElementById("value").value;
	var storeId = document.getElementById("storeId").value;
	var httpOnly = document.getElementById("httpOnly").checked;
	var value = document.getElementById("value").value;
	var path = document.getElementById("path").value;
	var secure = document.getElementById("secure").checked;
	var session = document.getElementById("session").checked;
	var expireDate = document.getElementById("expireDate").value;
	var expireTime = document.getElementById("expireTime").value;	
	

	chrome.cookies.set({
		url: "http://"+domain
		//,expirationDate: ""
		//,hostOnly: hostOnly
		,httpOnly: httpOnly
		,name: name
		,path: path
		//,sameSite: json.sameSite
//		,secure: secure
		//,session: session
		,storeId: storeId
		,value: value
	}, function (cookie) {
		console.log(chrome.extension.lastError);
		console.log(chrome.runtime.lastError);
	});
	refresh();		
}	


function remove(evt, type){
	var cookieData = [];
	var rowCount = tableDomain.rows.length;
	for(var i = rowCount - 1 ; i > -1; i --){
		var row = tableDomain.rows[i];
		var chkbox = row.cells[0].childNodes[0];
		var expand = row.cells[1].childNodes[0].getAttribute("expand");	
		var domain = row.cells[1].childNodes[0].innerHTML;
		if (null != chkbox && true == chkbox.checked && expand == "0" ){								
			tableDomain.deleteRow(row.rowIndex);
			removeCookie("domain",domain ,"" );			
		}else{
			var divMain = row.cells[1].childNodes[2];
			var length = divMain.children.length;
			for(var j = length -1 ; j > -1  ; j-- ){
				var divCookie = divMain.children[j];
				var chk = divCookie.childNodes[0].checked;
				var name = divCookie.childNodes[1].innerHTML;
				var secure = divCookie.childNodes[1].getAttribute("secure");
				if (chk){
					divCookie.remove();					
					if(divMain.children.length == 0){
						tableDomain.deleteRow(row.rowIndex);				
					}
					removeCookie("cookie",domain,name );
				}	
			}
		}
	}
	clearDetail();	
}

function removeCookie(type , domain , name){
	
	if(type == "domain"){	
		chrome.cookies.getAll({
		}, function (cookies) {
			for (var i = 0; i < cookies.length; i++) {
				if(cookies[i].domain.trim() === domain.trim()){
					var cookie = cookies[i];
					var url = (cookie.domain.charAt(0) == "." )? cookie.domain.substring(1):cookie.domain ;
					//console.log(cookies[i]);			
					chrome.cookies.remove({
						 url:"http://"+  url + cookie.path
						,name: cookie.name
					}, function (cookie) {
						console.log(chrome.extension.lastError);
						console.log(chrome.runtime.lastError);
					});	
					chrome.cookies.remove({
						 url:"https://"+ url + cookie.path
						,name: cookie.name
					}, function (cookie) {
						console.log(chrome.extension.lastError);
						console.log(chrome.runtime.lastError);
					});
					

				}
			}
		});			
	}else{
		url = (domain.charAt(0) == "." )? domain.substring(1):domain ;
		chrome.cookies.remove({
			url: "http://"+url
			,name: name
		}, function (cookie) {
			console.log(chrome.extension.lastError);
			console.log(chrome.runtime.lastError);
		});	
		chrome.cookies.remove({
			url: "https://"+url
			,name: name
		}, function (cookie) {
			console.log(chrome.extension.lastError);
			console.log(chrome.runtime.lastError);
		});			
	}	
}		

function refresh(){
	var search = document.getElementById('search').value;
	getDomain(search);
	clearDetail();
}		

function exportCookie(){
	var cookieSelects = [];
	var rowCount = tableDomain.rows.length;
	for(var i = rowCount - 1 ; i > -1; i --){
		var row = tableDomain.rows[i];
		var chkbox = row.cells[0].childNodes[0];
		var expand = row.cells[1].childNodes[0].getAttribute("expand");	
		var domain = row.cells[1].childNodes[0].innerHTML;
		if (null != chkbox && true == chkbox.checked && expand == "0" ) {								
			cookieSelects.push({type: "domain"  ,domain : domain , name: "" });			
		}else{
			var divMain = row.cells[1].childNodes[2];
			var length = divMain.children.length;
			for(var j = length -1 ; j > -1  ; j-- ){
				var divCookie = divMain.children[j];
				var chk = divCookie.childNodes[0].checked;
				var name = divCookie.childNodes[1].innerHTML;
				if (chk){
					cookieSelects.push({type: "cookie"  ,domain : domain , name: name });	
				}	
			}
		}
	}
	
	chrome.cookies.getAll({
		
	}, function (cookies) {
		var cookieData = [];		
		for(var i = 0 ; i < cookieSelects.length ; i++){
			var cookieSelect = cookieSelects[i];
			var type = cookieSelect.type;
			var domain = cookieSelect.domain;	
			var name = cookieSelect.name;
			for(var j = 0 ; j < cookies.length ; j++ ){
				var cookie = cookies[j]; 
				if(type == "domain"){
					if(cookie.domain.trim() == domain.trim()){
						cookieData.push(cookie);
					}						
				}else{
					if(cookie.domain.trim() == domain.trim() && cookie.name.trim() == name.trim()){
						cookieData.push(cookie);
					}					
				}	
			}			
		}
		exportFile(cookieData);
	});			
}		

function importCookie(){
	var files = document.getElementById('selectFiles').files;
	if (files.length <= 0){
		return false;
	}	
	var fr = new FileReader();
	fr.readAsText(files.item(0));
	fr.onload = (e) => {
		var content = JSON.parse(e.target.result);	
		for(var i = 0 ; i < content.length ; i++){
			var json = content[i];	
			var url = "http://" +((json.domain.charAt(0) == "." )?json.domain.substring(1):json.domain);
			var name =  (json.name.length >8)?json.name.substring(0,8) : json.name;
			chrome.cookies.set({
				url: url
				,expirationDate: json.expirationDate
				//,hostOnly: json.hostOnly
				,httpOnly: json.httpOnly
				,name: name
				,path: json.path
				//,sameSite: json.sameSite
				//,secure: json.secure
				//,session: json.session
				//,storeId: json.storeId
				,value: json.value
			}, function (cookie) {
				console.log(chrome.extension.lastError);
				console.log(chrome.runtime.lastError);
			});				
		}
		refresh();
	}
}

function expandAll(){
	var expandAll = document.getElementById("expandAll");
	var expand = expandAll.getAttribute("expand");	
	if(expand == "0"){
		var rows = tableDomain.rows;
		for(var i = 0 ; i < rows.length ; i++){
			var chk = rows[i].cells[1].childNodes[1];
			chk.click();	
		}
		expandAll.setAttribute("expand","1");		
	}else{
		expandAll.setAttribute("expand","0");
		refresh();		
	}
}

function selectFiles(){
	document.getElementById('selectFiles').value = "";
	document.getElementById('selectFiles').click();
}

function exportFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    let exportFileDefaultName = 'data.json';
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function getDomain(search) {
	var domainNames = [];
	var domainDetail = [];	
	tableDomain.innerHTML = "";	
	chrome.cookies.getAll({
		
	}, function (cookies) {
		for (var i = 0; i < cookies.length ; i++) {
			var domainName = cookies[i].domain;			 
			if(domainName.indexOf(search) !== -1 ){				
				domainNames.push(cookies[i].domain);				
			}			
		}		
		domainNames.sort();

		var domainCount = {};
		domainNames.forEach(x=>domainCount[x]=( domainCount[x] || 0)+1 );
		var domainCounts = new Map(Object.entries(domainCount));			
		var uDomainNames = Array.from(new Set(domainNames));

		for(var i = 0 ; i < uDomainNames.length  ; i++){
			//console.log(uDomainNames[i]);	
			
			var row = document.createElement("tr");
			
			var cell_1 = document.createElement("td");
			var cell_2 = document.createElement("td");
			var cell_3 = document.createElement("td");
			
			var input_check = document.createElement("input");
			input_check.setAttribute("type", "checkbox");
			input_check.setAttribute("id", uDomainNames[i] );
			cell_1.appendChild(input_check);
			
			var label_1 = document.createElement("label");
			label_1.innerHTML = uDomainNames[i] +"   ";
			label_1.setAttribute("id", "lab_" + uDomainNames[i] );
			label_1.setAttribute("expand", "0" );
			cell_2.appendChild(label_1);

			var input_expand = document.createElement("input");
			input_expand.setAttribute("type", "image");
			input_expand.setAttribute("src", "expand.png");
			input_expand.setAttribute("height", "7px");
			input_expand.setAttribute("id", "btn_" + uDomainNames[i] );
			input_expand.setAttribute("value", "Expand" );	
			
			var div = document.createElement("div");
			div.setAttribute("id", "div_" + uDomainNames[i] );
			div.appendChild(input_expand);			
			
			input_check.addEventListener('change', doDomainCheck.bind(null , event , uDomainNames[i] ,input_check , div));	
			input_expand.addEventListener('click', doDomainClick.bind(null , event , uDomainNames[i] , label_1 , input_expand ,input_check, div));	
			cell_2.appendChild(input_expand);	
			cell_2.appendChild(div);	
			
			
			var label_2 = document.createElement("label");
			label_2.innerHTML = domainCounts.get(uDomainNames[i]);
			cell_3.appendChild(label_2);		
			
			row.appendChild(cell_1);
			row.appendChild(cell_2);
			row.appendChild(cell_3);
			
			tableDomain.appendChild(row);			
			
		}
	});
}


function doDomainCheck(evt , domainName, inputCheck , divCookies){
	var nLength = divCookies.childNodes.length;
	for (var i = 0 ;i < divCookies.childNodes.length ; i++ ){
		var ele = divCookies.childNodes[i]
		var chk = ele.childNodes[0];
		ele.childNodes[0].checked = inputCheck.checked
	}		
}


function doDomainClick(evt , domainName, label , input_expand,input_check, divMain){
	var expand = label.getAttribute("expand");	
	if(expand == "0"){
		input_expand.setAttribute("style", "transform:rotate(180deg)");			
		label.setAttribute("expand","1");		
		var domainCookies = [];
		chrome.cookies.getAll({
			domain : domainName
		}, function (cookies) {
			for (var i = 0; i < cookies.length; i++) {
				if(cookies[i].domain.trim() === domainName.trim()){
					var div = document.createElement("div");
					var input_name = document.createElement("input");
					input_name.setAttribute("type", "checkbox");
					input_name.setAttribute("id",cookies[i].name );
					if(input_check.checked)input_name.setAttribute("checked",true);
					div.setAttribute("class","divCookie" );
					div.appendChild(input_name);		
					var label_1 = document.createElement("label");
					label_1.setAttribute("secure",cookies[i].secure?1:0);
					label_1.innerHTML = cookies[i].name;
					label_1.addEventListener('click', loadDetail.bind(null,event,domainName , cookies[i].name ));	
					div.appendChild(label_1);
					divMain.appendChild(div);						
				}
			}

		});			
	}else{
		divMain.innerHTML = "";
		label.setAttribute("expand","0");
		input_expand.setAttribute("style" , "transform:rotate(0deg)");			
	}
	
}

function init(){
	getDomain("");	
	var input = document.getElementById("search");
	input.addEventListener("keyup", function(event){
		if (event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("btnSearch").click();
		}
	});	
}	

document.addEventListener('DOMContentLoaded', init);
document.getElementById('chkAllDomain').addEventListener('click', doChkAllDomain);	
document.getElementById('btnSearch').addEventListener('click',search);	
document.getElementById('create').addEventListener('click',create);	
document.getElementById('remove').addEventListener('click',remove.bind(null,event,"domain"));		
document.getElementById('export').addEventListener('click', exportCookie);		
document.getElementById('import').addEventListener('click', selectFiles);	
document.getElementById('refresh').addEventListener('click',refresh);	
document.getElementById('selectFiles').addEventListener('change', importCookie);	
document.getElementById('expandAll').addEventListener('click', expandAll);





	