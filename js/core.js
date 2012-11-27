/**
* The GTalkChatNotifier class.
*/

function GTalkChatNotifier() {    
    var that = this;	
    this.setUpObservers();
    this.setUpExtensionListeners();
    this.hasOwnership = false;
    this.Buddies = new Object();	
    this.BuddiesLength = 0;
    this.reload();
}
GTalkChatNotifier.prototype.setUpObservers = function () {
    var that = this;
    this.imageElementObserver = new WebKitMutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
            debugMsg(logLevels.info, "In the observer.");
            var curTarget = mutations[i].target;
            var buddy = that.Buddies[curTarget.id];
            var OrigState = buddy.IsOnline;
            var alt = buddy.ImageElement.attr('alt');
            var NewState = GTalkChatNotifier.onOrOffline(alt);
            if (NewState && !OrigState && alt != 'Chatting') {
                debugMsg(logLevels.info, buddy.Name + " " + alt);
                that.showNotification('GTalk_Online', { 'Name': buddy.Name }, buddy.ID);
            }
            buddy.IsOnline = NewState;
        }
    });
};
GTalkChatNotifier.prototype.setUpExtensionListeners = function () {
    chrome.extension.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.type == 'click') {
                document.getElementById(request.id).click();
            }
        }
    );
};
/**
* Static method to determine the state of a buddy.
*/
GTalkChatNotifier.onOrOffline = function (state) {
    switch (state) {
		case "זמין":
			return true;
			break;
		case "זמין (וידאו מאופשר)":
			return true;
			break;
		case "לא פנוי":
			return true;
			break;
		case "סרק (מאופשר וידיאו)":
			return true;
			break;
		case "לא פעיל":
			return true;
			break;
		case "לא מקוון":
			return false;
			break;
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
            debugMsg(logLevels.error, "Unknown state: " + state);
            return false;
            break;
    }
};
GTalkChatNotifier.prototype.attainOwnership = function () {
    var that = this;
    chrome.extension.sendRequest({ action: 'attainOwnership' }, function (response) {
        if (response.hasOwnership) {
            that.hasOwnership = true;
        }
    });
    setTimeout(function () { that.attainOwnership(); }, 750);
}
/**
*
*/
GTalkChatNotifier.prototype.showNotification = function (type, text,id) {
        chrome.extension.sendRequest({
            action: 'notify',
            type: type,
            text: text,
			id: id
        });
};
GTalkChatNotifier.prototype.loadChatNotifier = function () {
    var that = this;
    var buddiesElementsArray = $("body").contents().find(".vC").toArray();
    //Initializing the Buddies array.
    for (var i = 0; i < buddiesElementsArray.length; i++) {
        if (buddiesElementsArray[i].id != ':99') {
            var Buddy = new Object();
            var jqueryElem = $(buddiesElementsArray[i]);

            //Getting the image.
            Buddy.ImageElement = jqueryElem.children().first().children().first().children().first();
            Buddy.TBodyElement = jqueryElem;
            Buddy.ID = Buddy.ImageElement.attr('id');

            var elemTest = jqueryElem.find('.az1').first();
            if (elemTest.children().length > 0) {
                Buddy.Name = elemTest.children().first().html();
            } else {
                Buddy.Name = elemTest.html();
            }

            Buddy.IsOnline = GTalkChatNotifier.onOrOffline(Buddy.ImageElement.attr('alt'));
            this.imageElementObserver.observe(Buddy.ImageElement[0], { attributes: true });
            this.Buddies[Buddy.ID] = Buddy;
			this.BuddiesLength++;
        }
    }
};

GTalkChatNotifier.prototype.reload = function () {
    debugMsg(logLevels.info, this.Buddies.length);
    if (this.BuddiesLength > 10) {
        return;
    }
    var that = this;
    this.loadChatNotifier();
    if (this.BuddiesLength < 10) {
        setTimeout(function () {
            that.reload();
        }, 500);
    }
};


$(document).ready(function () {
    var notifier = new GTalkChatNotifier();
});