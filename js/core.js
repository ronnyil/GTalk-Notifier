/**
* The GTalkChatNotifier class.
*/

function GTalkChatNotifier() {
    
    var that = this;
    this.observer = new WebKitMutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
            debugMsg(logLevels.info, "In the observer.");
            var curTarget = mutations[i].target;
            var buddy = that.Buddies[curTarget.id];
            var OrigState = buddy.IsOnline;
            var alt = buddy.ImageElement.attr('alt');
            var NewState = GTalkChatNotifier.onOrOffline(alt);
            if (NewState && !OrigState) {
                debugMsg(logLevels.info, buddy.Name + " " + alt);
                that.showNotification('GTalk', buddy.Name);                
            }
            buddy.IsOnline = NewState;
        }
    });
    this.hasOwnership = false;
    this.Buddies = Array();
    this.reload();
}
/**
* Static method to determine the state of a buddy.
*/
GTalkChatNotifier.onOrOffline = function (state) {
    switch (state) {
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
GTalkChatNotifier.prototype.showNotification = function (type, text) {
        chrome.extension.sendRequest({
            action: 'notify',
            type: type,
            text: text
        });
};
GTalkChatNotifier.prototype.loadChatNotifier = function () {
    var that = this;
    var buddiesElementsArray = $("body").contents().find(".vC").toArray();
    debugMsg(logLevels.info, "Num of buddies: " + buddiesElementsArray.length);

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
            this.observer.observe(Buddy.ImageElement[0], { attributes: true });
            this.Buddies[Buddy.ID] = Buddy;
        }
    }
};

GTalkChatNotifier.prototype.reload = function () {
    debugMsg(logLevels.info, this.Buddies.length);
    if (this.Buddies.length > 10) {
        return;
    }
    var that = this;
    this.loadChatNotifier();
    if (this.Buddies.length < 10) {
        setTimeout(function () {
            that.reload();
        }, 500);
    }
};


$(document).ready(function () {
    var notifier = new GTalkChatNotifier();
});