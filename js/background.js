var unCache = {
    checkCacheCleared: function () {
        console.log('Clearing cache...');
        this.clearCache();
    },

    clearCache: function () {
        var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
        var oneWeekAgo = (new Date()).getTime() - millisecondsPerWeek;
        chrome.browsingData.remove({
            "since": oneWeekAgo
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
        chrome.browserAction.setIcon({
            path: "img/logo_clean.png"
        });

        _gaq.push(['_trackEvent', 'clearCache', 'clicked']);
    },

    storageChanged: function (history_item) {
        chrome.browserAction.setIcon({
            path: "img/logo.png"
        });
    }
};

chrome.browserAction.onClicked.addListener(unCache.checkCacheCleared.bind(unCache));
chrome.history.onVisited.addListener(unCache.storageChanged.bind(unCache));
//chrome.storage.onChanged.addListener();