(function () {
    var storage = chrome.storage.sync;
    var Options = {
        // number of the simultaneously pressed keys
        pressed : 0,

        //Hot keys pattern
        pattern: [],

        load: function () {

            this.initHotKeys();
            this.setListeners();

        },

        /*
        * Init DOM elements for hot keys
        * and restore saved hot key combinations
        */
        initHotKeys: function () {
            this.hotKey = $('#asigner');
            this.combination = this.hotKey.find('.combination');
            this.status = this.hotKey.parent().find('.status');
            this.checkSavedKeys();
        },

        /*
        * Load previously saved combination from storage
        */
        checkSavedKeys: function () {
            var self = this;
            storage.get('pattern', function (items) {
                if (items.pattern.length) {
                    var str = self.stringPattern(items.pattern);
                    self.combination.text(str).show();
                }
            });
        },

        setListeners: function () {
            this.hotKey.on('click', 'a', this.startAssignment.bind(this));
        },

        /*
        * Assign hot keys combinations
        * @param e
        */
        startAssignment: function (e) {
            $(document).on('keydown', this.readKey.bind(this));
            $(document).on('keyup', this.savePattern.bind(this));
            this.combination.show().empty().text(this.combination.data('default'));
        },

        stopAssignment: function (e) {
            $(document).off('keydown');
            $(document).off('keyup');
        },

        readKey: function (e) {
            var keyCode = e.keyCode || e.which;
            console.log(keyCode);
            this.pressed++;
            console.log('pressed: ', this.pressed);
            // Mac Command button is a starter so reset.
            // So as CTRL and ALT or SHIFT
            if (keyCode == 91 || keyCode == 17 || keyCode == 18) {
                this.pattern = [];
                this.pattern.push(keyCode);
            } else {
                if (this.pressed > 1) {
                    // Move along if Control key is present in pattern
                    if (this.pattern.indexOf(91) != -1 ||
                        this.pattern.indexOf(17) != -1 ||
                        this.pattern.indexOf(18) != -1 ) {

                        //if shift pressed and it's not already present
                        if (keyCode == 16) {
                            if (this.pattern.indexOf(16) == -1) {
                                var tmp = [];
                                tmp.push(this.pattern[0]);
                                this.pattern = tmp;
                                this.pattern.push(keyCode);
                            }
                        } else {
                            if (this.pattern.length == 2) {
                                if (this.pattern.indexOf(16)) {
                                    this.pattern.push(keyCode);
                                } else {
                                    return;
                                }
                            } else if (this.pattern.length > 2) {
                                return;
                            } else {
                                var last = this.pattern.slice(-1)[0];
                                if (keyCode != last) {
                                    this.pattern.push(keyCode);
                                }
                            }
                        }
                    }
                    // return if entered just letter;
                    else {
                        this.pattern = [];
                        return;
                    }
                } else {
                    if (keyCode == 16) {
                        this.pattern.push(keyCode);
                    } else {
                        this.pattern = [];
                    }
                }
            }
            this.combination.text(this.stringPattern(this.pattern));
        },

        savePattern: function () {
            var self = this;
            this.pressed--;
            console.log('pressed: ', this.pressed);
            console.log('pattern:', this.pattern);
            if (this.pressed == 0 && this.pattern.length > 1) {
                // Save it using the Chrome extension storage API.
                storage.set({'pattern': this.pattern}, function() {
                    self.stopAssignment();
                    self.showStatus();
                });

                this.pattern = [];
                this.pressed = 0;
            }
        },

        showStatus: function () {
            var self = this;
            this.status.fadeIn(200, function () {
                setTimeout(function () {
                    self.status.fadeOut(500);
                }, 1000);
            });
        },

        stringPattern: function (pattern) {
            var result = [],
                len = pattern.length,
                letter, i, key;
            for (i = 0; i < len; i++ ) {
                key = pattern[i];
                if (this.isControlKey(key)) {
                    letter = this.getControlSymbol(key);
                } else {
                    letter = String.fromCharCode(key);
                }
                result.push(letter);
            }
            return result.join('+');
        },

        /*
        * Give key code and get know if it is control key.
        */
        isControlKey: function (code) {
            var control = [91, 17, 18, 16];
            return control.indexOf(code) != -1;
        },

        getControlSymbol: function (code) {
            var symbols = {
                16: "SHIFT",
                17: "CTRL",
                18: "ALT",
                91: "⌘"
            };
            if (symbols.hasOwnProperty(code)){
                return symbols[code];
            }
        }
    };

//DOM Ready
$(function () {
    Options.load();
});

})(document);