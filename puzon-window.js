var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

var Puzon = function(opts) {
    this.initialize.call(this, opts);
}

_.extend(Puzon.prototype, Backbone.Events, {
  initialize: function(options){
    this.element = $(options.element);
    this.idleTime = options.idleTime;
    this.clock = 0;
    this.lessonTimer = 0;
    this.start();
    this.bindAll();
  },
  tick: function() {
    this.clock++;
    this.lessonTimer++;
    if(this.clock > this.idleTime) {
      console.log('Idle time reached, pausing lesson');
      this.trigger('lesson_paused')
      this.pause();
    }
    console.log(this.clock, this.lessonTimer, this.idleTime);
  },
  reset: function() {
    console.log('reset called');
    this.clock = 0;
  },
  pause: function() {
    console.log('pausing');
    window.clearInterval(this.timer);
    this.clock = 0;
  },
  start: function(offset) {
    console.log('resuming');
    this.timer = setInterval(_.bind(function() {
      this.tick();
    }, this), 1000);
  },
  bindAll: function(){
    this.element.get(0).addEventListener("click", _.bind(this.reset, this), true);
    this.element.get(0).addEventListener("scroll", _.bind(this.reset, this), true);
    this.element.get(0).addEventListener("blur", _.bind(this.pause, this), true);
    this.element.get(0).addEventListener("focus", _.bind(this.start, this), true);
    this.element.get(0).addEventListener("mousemove", _.bind(this.reset, this), true);
    this.element.get(0).addEventListener("keypress", _.bind(this.reset, this), true);
  }
})
module.exports = Puzon;