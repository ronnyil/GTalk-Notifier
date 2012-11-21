function Queue() {
    this.queue = new Array();
    this.length = 0;
    this.dequeue = function () {
        this.length--;
        return this.queue.pop();
    };
    this.enqueue = function (item) {
        this.length++;
        this.queue.unshift(item);
    };
    this.remove = function (item) {
        for (var i = 0; i < this.queue.length; i++) {
            if (this.queue[i] == item) {
                this.length--;
                this.queue.splice(i, 1);
            }
        }
    };
    this.containsItem = function (item) {
        for (var i = 0; i < this.queue.length; i++) {
            if (this.queue[i] == item) {
                return true;
            }
        }
        return false;
    };
    this.enqueueIfNew = function (item) {
        if (!this.containsItem(item)) {
            this.enqueue(item);
            return true;
        }
        return false;
    };
}

function App() {
    this.testAndSetLocalStorage();
    this.waitingQueue = new Queue();
    this.OwnerId = null;
    this.setUpExtensionListeners();
};


App.prototype.setUpExtensionListeners = function () {
    var that = this;

    chrome.extension.onRequest.addListener(function (request, sender, callback) {
        that.onRequest(request, sender, callback);
    });
    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
        that.removeTab(tabId);
    });
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        that.removeTab(tabId);
    });
};


App.prototype.removeTab = function (tabId) {
    var that = this;
    if (tabId == that.OwnerId) {
        debugMsg(logLevels.info, "Owner tab removed.");
        debugMsg(logLevels.info, JSON.stringify(that.waitingQueue));
        if (that.waitingQueue.length == 0) {
            that.OwnerId = null;
        } else {
            that.OwnerId = that.waitingQueue.dequeue();
            debugMsg(logLevels.info, "New owner tab: " + that.OwnerId);
        }
    } else {
        that.waitingQueue.remove(tabId);
        debugMsg(logLevels.ino, "Tab #" + tabId + " removed from the queue.");
    }
};


App.prototype.onRequest = function (request, sender, callback) {
    debugMsg(logLevels.info, "Request: " + request.action);
    switch (request.action) {
        case 'notify':
            if (this.OwnerId == null) {
                this.OwnerId = sender.tab.id;
                debugMsg(logLevels.info, "New owner tab: " + this.OwnerId);
            } else if (sender.tab.id != this.OwnerId) {
                if (this.waitingQueue.enqueueIfNew(sender.tab.id)) {
                    debugMsg(logLevels.info, "New tab in queue: " + sender.tab.id);
                }
                return;
            }
            try {
                this.showNotification(request.type, request.text, function () { });
            } catch (err) {
                debugMsg(logLevels.error, "Error: " + err);
            }
            break;
        case 'attainOwnership':
            var responseObject = {};
            if (this.OwnerId == null) {
                this.OwnerId = sender.tab.id;
                responseObject.hasOwnership = true;
            } else {

                responseObject.hasOwnership = false;
            }
            callback(responseObject);
        default:
            debugMsg(logLevels.error, "Unknown action: " + request.action);
    }
};

App.prototype.showNotification = function (type, text, callback) {
    debugMsg(logLevels.info, "Notification: " + text);
    switch (type) {
        case 'GTalk':
            title = "gtalkNotificationTitle";
            logo = "icons/icon48.png";

            text = text + ' ' + chrome.i18n.getMessage("gtalkContactSignonNotification");

            break;
        default:
            debugMsg(logLevels.error, "Unknown notification type: " + type);

    }
    try {
        debugMsg(logLevels.info, chrome.extension.getURL(logo));
        var notification = window.webkitNotifications.createNotification(
                            logo,
                            chrome.i18n.getMessage(title),
                            text);
        notification.show();
        var sec = localStorage["num_of_sec"];
        if (sec != 0) {
            setTimeout(function () {
                notification.cancel();
            }, sec * 1000);
        }
    } catch (err) {
        debugMsg(logLevels.error, "Notification permission needed: " + err);
        window.webkitNotifications.requestPermission();
    }
};
App.prototype.testAndSetLocalStorage = function () {
    var tst = localStorage["num_of_sec"];
    if (typeof tst == 'undefined') {
        localStorage["num_of_sec"] = 3;
    }
};

var theApp = new App();