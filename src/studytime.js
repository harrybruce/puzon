var Backbone = require("backbone");
var $ = require("jquery");
var _ = require("underscore");
var Clock = require("./clock.js");


var StudyTime = function(opts) {
    this.initialize.call(this, opts);
};

_.extend(StudyTime.prototype, Backbone.Events, {
    initialize: function(options){
        this.element = $(options.element);
        options.getCallback(_.bind(this.continueCallBack, this));

        this.clock = new Clock({idleTime: 10});
        this.bindAll();

    },
    continueCallBack: function() {
        this.clock.continue();
    },
    handleWindowFocus: function() {
        if(document.visibilityState === "hidden") {
            this.clock.pause();
        } else {
            this.clock.start();
        }
    },
    bindAll: function(){
        this.element.get(0).addEventListener("click", _.bind(this.clock.reset, this.clock), true);
        this.element.get(0).addEventListener("scroll", _.bind(this.clock.reset, this.clock), true);
        this.element.get(0).addEventListener("mousemove", _.bind(this.clock.reset, this.clock), true);
        this.element.get(0).addEventListener("keypress", _.bind(this.clock.reset, this.clock), true);
        this.setUpVisibilityHandlers();
    },
    setUpVisibilityHandlers: function() {
        $(window).get(0).addEventListener("visibilitychange", _.bind(this.handleWindowFocus, this), true);
    }
});
module.exports = StudyTime;
