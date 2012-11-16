(function () {
    var storage = chrome.storage.sync,
        pattern = [],
        pressed = 0,
        matched = 0;

    storage.get('pattern', function (items) {
	if (items) {
	    if (items.pattern && items.pattern.length) {
    	        pattern = items.pattern;
	    }
	}
    });

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
        if (pattern.indexOf(keyCode) != -1) {
            matched = 0;
        }
        if (pressed == 0) {
            matched = 0;
        }
    }

})();

