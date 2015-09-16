var $ = require("jquery");
var _ = require("underscore");
var Backbone = require("backbone");
var LocalStorage = require("./local-storage.js");

var Clock = function(opts) {
    this.initialize.call(this, opts);
};

_.extend(Clock.prototype, Backbone.Events, {
    initialize: function(options){
        console.log("Clock initialsing with: ", options);
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
        this.start();
    },
    tick: function() {
        this.times.inactiveTimer++;
        this.times.lessonTimer++;
        console.log("Tick: ", this.times.inactiveTimer, this.times.lessonTimer);
        this.reportTiming();
        if(this.times.inactiveTimer > this.idleTime) {
            this.idleTimeReached();
        }
    },
    reset: function() {
        console.log("Reset");
        this.times.inactiveTimer = 0;
    },
    pause: function() {
        console.log("Pause");
        window.clearInterval(this.clocks.mainClock);
        this.clocks.mainClock = null;
        this.times.inactiveTimer = 0;
    },
    start: function() {
        debugger;
        this.times.lessonTimer = this.fetchTiming() + this.times.idleTimer;
        console.log("Starting: ", this.times.lessonTimer);
        if(!this.timer) {
            this.clocks.mainClock = setInterval(_.bind(function() {
                this.tick();
            }, this), 1000);
        }
    },
    continue: function() {
        console.log("Continue");
        if(!this.idleThresholdReached) {
            //User clicked within 60 seconds
            this.pause();
            this.start();
        } else {
            //User didn't click within 60 seconds.
            //NOT SURE WHAT TO DO HERE.
        }
    },
    reportTiming: function() {
        //TODO
        //Set remotely stored times
        LocalStorage.set("lessonTimer", this.times.lessonTimer);
    },
    fetchTiming: function() {
        //TODO
        //Get remotely stored times
        return Number(LocalStorage.get("lessonTimer")) || 0;
    },
    idleTimeReached: function() {
        console.log('IdleTimeReached');
        this.trigger("lesson_paused");
        this.times.idleTimer = 0;
        this.pause();
        this.clocks.idleClock = setInterval(_.bind(function() {
            this.times.idleTimer++;
            console.log("Running idle timer: ", this.times.idleTimer);
            if(this.times.idleTimer === 60) {
                this.idleThresholdReached = true;
                window.clearInterval(this.clocks.idleClock);
            }
        }, this), 1000);
    }
});

module.exports = Clock;
