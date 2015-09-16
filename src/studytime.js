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

        this.clock = new Clock({idleTime: 5});
        this.listenTo(this.clock, "lesson_paused", function() {
            this.trigger("lesson_paused");
            this.unbindAll();
        });
        this.bindAll();

    },
    continueCallBack: function() {
        this.bindAll();
        this.clock.continue();
    },
    handleWindowFocus: function() {
        if(document.visibilityState === "hidden") {
            this.clock.pause();
        } else {
            this.clock.start();
        }
    },
    unbindAll: function() {
        this.element.get(0).removeEventListener("click", this.handler, true);
        this.element.get(0).removeEventListener("scroll", this.handler, true);
        this.element.get(0).removeEventListener("mousemove", this.handler, true);
        this.element.get(0).removeEventListener("keypress", this.handler, true);
        $(window).get(0).removeEventListener("visibilitychange", this.focusHandler, true);
    },
    bindAll: function(){
        this.handler = _.bind(this.clock.reset, this.clock);
        this.element.get(0).addEventListener("click", this.handler, true);
        this.element.get(0).addEventListener("scroll", this.handler, true);
        this.element.get(0).addEventListener("mousemove", this.handler, true);
        this.element.get(0).addEventListener("keypress", this.handler, true);
        this.setUpVisibilityHandlers();
    },
    setUpVisibilityHandlers: function() {
        this.focusHandler =  _.bind(this.handleWindowFocus, this);
        $(window).get(0).addEventListener("visibilitychange", this.focusHandler, true);
    }
});
module.exports = StudyTime;
