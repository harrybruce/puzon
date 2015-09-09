var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

var Puzon = function(opts) {
    this.initialize.call(this);
}

_.extend(Puzon.prototype, Backbone.Events, {
  initialize: function(options){
    this.clock = 0;
    this.lessonTimer = 0;
    this.start();
    this.bindAll();
  },
  tick: function() {
    this.clock++;
    this.lessonTimer++;
    console.log(this.clock, this.lessonTimer);
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
    $(window).bind('click', _.bind(this.reset, this));
    $(window).scroll( _.bind(this.reset, this));
    $(window).bind('blur', _.bind(this.pause, this));
    $(window).bind('focus', _.bind(this.start, this));
  }
})
module.exports = new Puzon();
