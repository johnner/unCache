var unCache = {
    checkCacheCleared: function () {
        console.log('Clearing cache...');
        this.clearCache();
    },

    clearCache: function () {
        var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
        var oneWeekAgo = (new Date()).getTime() - millisecondsPerWeek;
        var all = 0;
        chrome.browsingData.remove({
            "since": all
        }, {
            "appcache": true,
            "cache": true,
            "cookies": false,
            "downloads": false,
            "fileSystems": true,
            "formData": false,
            "history": false,
            "indexedDB": true,
            "localStorage": true,
            "pluginData": false,
            "passwords": false,
            "webSQL": false
        });
        this.setDoneIcon();

        setTimeout(this.setDefaultIcon, 3000);
    },

    storageChanged: function (history_item) {
        this.setDefaultIcon();
    },

    setDefaultIcon: function () {
        chrome.browserAction.setIcon({
            path: "img/logo.png"
        });
    },

    setDoneIcon: function () {
        chrome.browserAction.setIcon({
            path: "img/logo_clean.png"
        });
    },
    checKey: function (e) {
        alert('key pressed');
    }
};
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('clear cache!!', request.clear);
    if (request.clear === 1) {
        unCache.clearCache.apply(unCache);
    }
});

chrome.browserAction.onClicked.addListener(unCache.checkCacheCleared.bind(unCache));
chrome.history.onVisited.addListener(unCache.storageChanged.bind(unCache));
//chrome.storage.onChanged.addListener();