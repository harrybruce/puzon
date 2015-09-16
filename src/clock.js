var $ = require("jquery");
var _ = require("underscore");
var Backbone = require("backbone");

var Clock = function(opts) {
    this.initialize.call(this, opts);
};

_.extend(Clock.prototype, Backbone.Model, {
    initialize: function(options){
        this.times = {
            inactiveTimer: 0,
            idleTimer: 0,
            lessonTimer: 0
        };
        this.clocks = {
            mainClock: null,
            idleClock: null
        };
        this.idleTime = options.idleTime;
        options.getCallback(_.bind(this.continueCallBack, this));
        this.start();
    },
    tick: function() {
        this.times.inactiveTimer++;
        this.times.lessonTimer++;
        this.reportTiming();
        if(this.times.inactiveTimer > this.idleTime) {
            this.idleTimeReached();
        }
    },
    reset: function() {
        this.times.inactiveTimer = 0;
    },
    pause: function() {
        window.clearInterval(this.clocks.mainClock);
        this.clocks.mainClock = null;
        this.times.inactiveTimer = 0;
    },
    start: function() {
        this.times.lessonTimer = this.fetchTiming() + this.idleTime;
        if(!this.timer) {
            this.clocks.mainClock = setInterval(_.bind(function() {
                this.tick();
            }, this), 1000);
        }
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


    //The two methods below will talk to a reporting module (probably)
    //to get/set times remotely
    reportTiming: function() {
        //TODO
        //Set remotely stored times
        LocalStorage.set("lessonTimer", this.times.lessonTimer);
    },
    fetchTiming: function() {
        //TODO
        //Get remotely stored times
        return LocalStorage.get("lessonTimer") || 0;
    },
    idleTimeReached: function() {
        this.trigger("lesson_paused");
        this.times.idleTimer = 0;
        this.pause();
        this.clocks.idleClock = setInterval(_.bind(function() {
            this.times.idleTimer++;
            if(this.times.idleTimer === 60) {
                this.idleThresholdReached = true;
                window.clearInterval(this.clocks.idleClock);
            }
        }, this), 1);
    }
});

module.exports = Clock;
