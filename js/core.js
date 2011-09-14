// jquery.escape 1.0 - escape strings for use in jQuery selectors
// http://ianloic.com/tag/jquery.escape
// Copyright 2009 Ian McKellar <http://ian.mckellar.org/>
// Just like jQuery you can use it under either the MIT license or the GPL
// (see: http://docs.jquery.com/License)
(function() {
escape_re = /[#;&,\.\+\*~':"!\^\$\[\]\(\)=>|\/\\]/;
jQuery.escape = function jQuery$escape(s) {
  var left = s.split(escape_re, 1)[0];
  if (left == s) return s;
  return left + '\\' + 
    s.substr(left.length, 1) + 
    jQuery.escape(s.substr(left.length+1));
}
})();

var canvas;
var Buddys;
$(document).ready(function()
{

		canvas = document.getElementById('canvas_frame').contentDocument;
		$(canvas).ready(check);
});
function check(){
		/*	elem = canvas.getElementById(":91");
			debugMsg(logLevels.info,"Debugging: Here I am");
			if(elem == null) { setTimeout(check,10); return; }
			var style = $(elem).attr("style");			
			if(style == 'undefined' || style == undefined) { setTimeout(check,10); return; }
			debugMsg(logLevels.info,"Debugging: Here I am");
			if(style.trim() != "display: none;") { setTimeout(check,10); return; }
            debugMsg(logLevels.info,"Done loading, starting up.")*/
			StartUp();
}
var notifier;
function StartUp()
{
	notifier = chatNotifier.loadChatNotifier();	
	setTimeout(chatNotifier.reload,10000);
}
var chatNotifier = {
	reload: function() {
		debugMsg(logLevels.info,"Reloading");
		for(buddy in Buddys)
		{
			var tbody = canvas.getElementById(buddy);
			tbody.removeEventListener("DOMSubtreeModified",chatNotifier.checkModification);
		}
		Buddys = null;
		chatNotifier.loadChatNotifier();
		//chatNotifier.logBuddies();
		setTimeout(chatNotifier.reload,10000);
	},
	loadChatNotifier: function(){
		Buddys = Array();
		var arr = $("#canvas_frame").contents().find(".vC").toArray();
		for(i = 0; i < arr.length; i++){
			//console.log("ID: " + arr[i].id);
			if(arr[i].id != ':99'){
			elem = $(arr[i]);
			var imgElem = elem.children().first().children().first().children().first();
			var Buddy = new Object();
            			
			Buddy.TbodyElement = elem;
            
			Buddy.ID = elem.attr("id");
            Buddy.ImageElement = imgElem;
			Buddy.Name = elem.find(".HHshnc").first().html();
			
			Buddy.IsOnline = this.onOrOffline(imgElem.attr("alt"));
            
            regElem = canvas.getElementById(elem.attr('id'));
			Buddys[Buddy.ID] = Buddy;	            
            regElem.addEventListener("DOMSubtreeModified",this.checkModification);
			}
		}
		return this;
	},
    checkModification: function(event){  
   //     debugMsg(logLevels.info,event.target.nodeName + " " + )
        if(event.target.nodeName != 'IMG'){
            return;
        }
        var buddy = Buddys[event.currentTarget.id];
        var origState = buddy.IsOnline;
        var alt = canvas.getElementById(event.target.id).getAttribute('alt');
        debugMsg(logLevels.info,"New one: " + buddy.Name + "  " +  alt);
        var newState = chatNotifier.onOrOffline(alt);
        if(!newState){
            chatNotifier.showNotification('GTalk',buddy.Name);
        }
        Buddys[event.currentTarget.id].IsOnline = newState;
    },
    showNotification: function(type,text){
        chrome.extension.sendRequest({
            action:'notify',
            type:type,
            text:text
        });
     //   debugMsg(logLevels.info,"TYPE: " + type + " BUDDY: " + text);
        
    },
	onOrOffline: function(state){
		//var logStr = (state == "") ? "Mobile" : state;
		//console.log("Logging " + logStr);
		switch(state)
		{
			case "Available":
				return true;
				break;
			case "Available (video enabled)":
				return true;
				break;
			case "Busy":
				return true;
				break;
			case "Busy (video enabled)":
				return true;
				break;
			case "Idle (video enabled)":
				return true;
				break;
			case "Idle":
				return true;
				break;
            case "Chatting":
                return true;
                break;
			case "Offline":
				return false;
				break;
			case "":
				return false;
				break;
			default:
				debugMsg(logLevels.error,"Unknown state: " + state);
				return false;
				break;
		}			
	},
	logBuddies: function(){		
		for(var buddy in Buddys)
		{
			var logString = "";
			logString = logString + "--BUDDYS-- " + Buddys[buddy].ID + ", " + Buddys[buddy].Name + " - ";
			logString = logString + (Buddys[buddy].IsOnline ? "Online" : "Offline");
			debugMsg(logLevels.info,logString);
		}
		
	}
}
