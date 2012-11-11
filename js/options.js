(function () {
    var storage = chrome.storage.sync;
    var Options = {
        // number of the simultaneously pressed keys
        pressed : 0,

        //Hot keys pattern
        pattern: [],

        hint: 'Please type CTRL/ALT/CMD first',

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
            this.hotKey.on('click', 'button', this.startAssignment.bind(this));
        },

        /*
        * Assign hot keys combinations
        * @param e
        */
        startAssignment: function (e) {
            this.combination.
                show().
                empty().
                text(this.combination.data('default')).
                addClass('active');
            if ( this.in_assign !== 1) {
                $(document).on('keydown', this.readKey.bind(this));
                $(document).on('keyup', this.unPressed.bind(this));
                this.in_assign = 1;
            }
        },

        stopAssignment: function (e) {
            this.in_assign = 0;
            this.combination.removeClass('active');
            $(document).off('keydown');
            $(document).off('keyup');
        },

        unPressed: function () {
            if (this.pressed > 0) {
                this.pressed--;
            }
            if (this.pressed == 0) {
                this.combination.show();
                if (this.combination.text() !== this.hint) {
                    this.combination.empty();
                }
                this.stopAssignment();
            }
        },

        readKey: function (e) {
            var keyCode = e.keyCode || e.which;
            this.pressed++;
            // Mac Command button is a starter so reset.
            // So as CTRL and ALT or SHIFT
            if (keyCode == 91 ||
                keyCode == 17 ||
                keyCode == 18 ||
                keyCode == 16) {
                this.pattern = [];
                this.pattern.push(keyCode);
                this.combination.text(this.stringPattern(this.pattern));
            } else {
                if (this.pressed > 1) {
                    // Move along if Control key is present in pattern
                    if (this.pattern.indexOf(91) != -1 ||
                        this.pattern.indexOf(17) != -1 ||
                        this.pattern.indexOf(18) != -1 ||
                        this.pattern.indexOf(16) != -1) {
                            if (this.pattern.length <= 2) {
                                this.pattern.push(keyCode);
                                this.combination.text(this.stringPattern(this.pattern));
                                this.savePattern();
                            }
                    }
                    // return if entered just letter;
                    else {
                        this.typeHint();
                        this.clearPattern();
                        return true;
                    }
                } else {
                    this.typeHint();
                    this.clearPattern();
                    return true;
                }
            }
        },

        typeHint: function () {
            this.combination.text(this.hint);
        },

        clearPattern: function () {
            this.pattern = [];
            this.pressed = 0;
        },
        savePattern: function () {
            var self = this;
            // Save it using the Chrome extension storage API.
            storage.set({'pattern': this.pattern}, function() {
                self.stopAssignment();
                self.showStatus();
            });
            this.combination.text(this.stringPattern(this.pattern));
            this.pattern = [];
            this.pressed = 0;
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
                if (this.isSpecial(key)) {
                    letter = this.getSpecialSymbol(key);
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
        isSpecial: function (code) {
            var control = [91, 17, 18, 16, 20,
                            219, 221, 186, 222,
                            220, 188, 190, 191,
                            192, 32];
            return control.indexOf(code) != -1;
        },

        getSpecialSymbol: function (code) {
            var symbols = {
                16: "SHIFT",
                17: "CTRL",
                18: "ALT",
                91: "⌘",
                20: "CAPS",
                219: "[",
                221: "]",
                186: ";",
                222: "'",
                220: "\\",
                188: ",",
                190: ".",
                191: "/",
                192: "±",
                32: "SPACE"
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