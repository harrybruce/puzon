var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var LocalStorage = require('local-puzon');

var Puzon = function(opts) {
    this.initialize.call(this, opts);
}

_.extend(Puzon.prototype, Backbone.Events, {
  initialize: function(options){
    this.element = $(options.element);
    this.idleTime = options.idleTime;
    this.clock = 0;
    //Probably a better way of doing this, but at the moment, in order
    //to get notified when the user decides to continue the lesson.
    //Might be a better idea to let the calling code just call 'start'
    //and 'pause' itself.
    options.getCallback(_.bind(this.continueCallBack, this));

    this.bindAll();

    //Whether or not this is called in init could be a config option?
    this.start();
  },
  tick: function() {
    this.clock++;
    this.lessonTimer++;
    console.log(this.clock, this.lessonTimer);
    this.reportTiming();
    if(this.clock > this.idleTime) {
      console.log('Idle time reached, pausing lesson');
      this.trigger('lesson_paused')
      this.pause();
    }
  },
  reset: function() {
    console.log('resetting');
    this.clock = 0;
  },
  pause: function() {
    console.log('pausing');
    window.clearInterval(this.timer);
    this.timer = null;
    this.clock = 0;
  },
  start: function(offset) {
    console.log('starting');
    this.lessonTimer = this.fetchTiming();
    if(!this.timer) {
      this.timer = setInterval(_.bind(function() {
        this.tick();
      }, this), 1000);
    }
  },
  continueCallBack: function() {
    this.pause();
    this.start();
  },

  //Page visibility API is only available in modern browsers
  //(All the supported ones). If trying to use in older browsers,
  //we'll get misleading timings if the user changes switchs tabs
  //back and forth.
  handleWindowFocus: function(evt) {
    if(document.visibilityState === 'hidden') {
      this.pause();
    } else {
      this.start();
    }
  },

  //The two methods below will talk to a reporting module (probably)
  //to get/set times remotely
  reportTiming: function() {
    //TODO
    //Set remotely stored times
    LocalStorage.set("lessonTimer", this.lessonTimer);
  },
  fetchTiming: function() {
    //TODO
    //Get remotely stored times
    return LocalStorage.get('lessonTimer') || 0;
  },
  bindAll: function(){
    this.element.get(0).addEventListener("click", _.bind(this.reset, this), true);
    this.element.get(0).addEventListener("scroll", _.bind(this.reset, this), true);
    this.element.get(0).addEventListener("mousemove", _.bind(this.reset, this), true);
    this.element.get(0).addEventListener("keypress", _.bind(this.reset, this), true);
    this.setUpVisibilityHandlers();
  },
  setUpVisibilityHandlers: function() {
    $(window).get(0).addEventListener("visibilitychange", _.bind(this.handleWindowFocus, this), true);
  }
})
module.exports = Puzon;
