function onRequest(request,sender,callback){
    debugMsg(logLevels.info,"Request: " + request.action);
    switch(request.action){
        case 'notify':
		try{			
			showNotification(request.type,request.text,function(){});
		}catch(err){
			debugMsg(logLevels.error,"Error: " + err);
		}
			break;
        default:
            debugMsg(logLevels.error,"Unknown action: " + request.action);
    }   
}



function showNotification(type,text,callback){
    debugMsg(logLevels.info,"Notification: " + text);
    switch (type) {
        case 'GTalk':
            title = "gtalkNotificationTitle";
            logo = chrome.extension.getURL("icons/icon48.png");			
            final_text = text + ' ' + chrome.i18n.getMessage("gtalkContactSignonNotification");
            break;
		case 'Facebook':
			title = "fbNotificationTitle";
			logo = text.logo;
			final_text = text.text + ' ' + chrome.i18n.getMessage("fbContactSignonNotification");
			break;
        default:
            debugMsg(logLevels.error,"Unknown notification type: " + type);
            
    }
    try{
            var notification = window.webkitNotifications.createNotification(
                                logo,
                                chrome.i18n.getMessage(title),
                                final_text);
            notification.show();
			var sec = localStorage["num_of_sec"];
			if(sec != 0){
            setTimeout(function(){
                notification.cancel();
            },sec * 1000);
			} 
    } catch(err){
        debugMsg(logLevels.error,"Notification permission needed: " + err);
        window.webkitNotifications.requestPermission();
    }    
}
var tst = localStorage["num_of_sec"];
if(typeof tst == 'undefined'){
	localStorage["num_of_sec"] = 3;
}
chrome.extension.onRequest.addListener(onRequest);