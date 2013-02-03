(function () {
    var storage = chrome.storage.sync,
        pattern = [],
        pressed = 0,
        matched = 0;

    //Bugfix for http://code.google.com/p/chromium/issues/detail?id=151838
    if (document.doctype !== null){
        storage.get('pattern', function (items) {
            try {
                if (items && items.pattern && items.pattern.length) {
                    pattern = items.pattern;
                }
            } catch (e) {
                return;
            }
        });
    }


    window.addEventListener("keydown", keySender, false);
    function keySender (e) {
        pressed++;
        var keyCode = e.keyCode || e.which;
        if (pattern.indexOf(keyCode) != -1) {
            matched++;
        }
        if (pressed == pattern.length && pressed == matched) {
            chrome.extension.sendMessage({clear: 1});
            matched = 0;
            pressed = 0;
        }
    }

    window.addEventListener("keyup", keyUp, false);
    function keyUp (e) {
        pressed = 0;
        var keyCode = e.keyCode || e.which;
        if (pattern.indexOf(keyCode) !== -1) {
            matched = 0;
        }
        if (pressed == 0) {
            matched = 0;
        }
    }

})();

