var Backbone = require("backbone");
var $ = require("jquery");
var _ = require("underscore");
var Clock = require("./clock.js");
var LocalStorage = require("./local-storage.js");

var StudyTime = function(opts) {
    this.initialize.call(this, opts);
};

_.extend(StudyTime.prototype, Backbone.Events, {
    initialize: function(options){
        this.element = $(options.element);
        options.getCallback(_.bind(this.continueCallBack, this));

        this.bindAll();
        this.Clock = new Clock({options.idleTime: 10});

    },
    continueCallBack: function() {
        if(!this.idleThresholdReached) {
            //User clicked within 60 seconds
            this.pause();
            this.start();
        } else {
            //User didn't click within 60 seconds.
            //NOT SURE WHAT TO DO HERE.
        }
    },
    handleWindowFocus: function() {
        if(document.visibilityState === "hidden") {
            this.clock.pause();
        } else {
            this.clock.start();
        }
    },
    bindAll: function(){
        this.element.get(0).addEventListener("click", _.bind(this.clock.reset, this), true);
        this.element.get(0).addEventListener("scroll", _.bind(this.clock.reset, this), true);
        this.element.get(0).addEventListener("mousemove", _.bind(this.clock.reset, this), true);
        this.element.get(0).addEventListener("keypress", _.bind(this.clock.reset, this), true);
        this.setUpVisibilityHandlers();
    },
    setUpVisibilityHandlers: function() {
        $(window).get(0).addEventListener("visibilitychange", _.bind(this.handleWindowFocus, this), true);
    }
});
module.exports = StudyTime;
