var isWebKit = 'WebkitAppearance' in document.documentElement.style;

var whenReady = (function() { // This function returns the whenReady() function
    var funcs = []; // The functions to run when we get an event
    var ready = false; // Switches to true when the handler is triggered
    // The event handler invoked when the document becomes ready
    function handler(e) {
        // If we've already run once, just return
        if (ready) return;
        // If this was a readystatechange event where the state changed to
        // something other than "complete", then we're not ready yet
        if (e.type === "readystatechange" && document.readyState !== "complete") return;

        // Run all registered functions.
        // Note that we look up funcs.length each time, in case calling
        // one of these functions causes more functions to be registered.
        for (var i = 0; i < funcs.length; i++) funcs[i].call(document);
        // Now set the ready flag to true and forget the functions
        ready = true;
        funcs = null;
    }

    // Register the handler for any event we might receive
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", handler, false);
        document.addEventListener("readystatechange", handler, false);
        window.addEventListener("load", handler, false);
    } else if (document.attachEvent) {
        document.attachEvent("onreadystatechange", handler);
        window.attachEvent("onload", handler);
    }

    // Return the whenReady function
    return function whenReady(f) {
        if (ready) f.call(document); // If already ready, just run it
        else funcs.push(f); // Otherwise, queue it for later.
    }
}());

var addEvent = function(elem, type, eventHandle) {
    if (elem == null || typeof(elem) == 'undefined') return;
    if (elem.addEventListener) {
        elem.addEventListener(type, eventHandle, false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + type, eventHandle);
    } else {
        elem["on" + type] = eventHandle;
    }
};

;
(function(window) {
    'use strict';

    function extend(x, y) {
        for (var key in y) {
            if (y.hasOwnProperty(key)) {
                x[key] = y[key];
            }
        }
        return x;
    }

    function tabView(el, opts) {
        this.options = extend({}, this.options);
        this.el = el;
        extend(this.options, opts);
        this._init();
    }

    // start tab defaults to 0 (tabs are 0 indexed)
    // specifiy options when tabView instance is created
    // like so..
    // tabs = new tabView( document.getElementById( 'tabs' ), {start:1});
    tabView.prototype.options = { start: 0 };

    tabView.prototype._init = function() {
        this.tabs = [].slice.call(this.el.querySelectorAll('nav > ul > li'));
        this.contents = [].slice.call(this.el.querySelectorAll('.content > section'));
        this.dex = -1;
        this._show();
        this._initEvents();
    };

    tabView.prototype._initEvents = function() {
        var self = this;
        this.tabs.forEach(function(tab, idx) {
            tab.addEventListener('click', function(ev) {
                ev.preventDefault();
                self._show(idx);
            });
        });
    };
    tabView.prototype._show = function(idx) {
        if (this.dex >= 0) {
            this.tabs[this.dex].className = '';
            this.contents[this.dex].className = '';
        }
        this.dex = idx != undefined ? idx : this.options.start >= 0 && this.options.start < this.contents.length ? this.options.start : 0;
        this.contents[this.dex].className = 'content-current';
        this.tabs[this.dex].className = 'tab-current';
    };
    window.tabView = tabView;
})(window);

tabs = new tabView(document.getElementById('tabs'), { start: 0 });
var drawPage = function() {
    currentTab = tabs.tabs[tabs.dex];
    loc = $(currentTab).position();
    $('.underline-left').css('left', 0);

    // This is a hack for webkit browsers to display the underline below
    // the non-active tabs in just the right place webkit has 1 pixel difference
    posi = $(currentTab).position().top + $(currentTab).height()

    posi = (isWebKit || $(".tabs nav a span").css('display') == "none") ? posi - 2 : posi - 1;

    $('.underline-left').css('top', posi);

    $('.underline-left').css('display', "block");
};

WebFont.load({
    google: {
        families: ['Pacifico', 'Lobster', 'Anton', 'Devonshire']
    }
});

whenReady(function() {
    drawPage();
});

addEvent(window, "resize", drawPage);

$(window).load(function() {
    drawPage();
});