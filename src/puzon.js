
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

var Puzon = function(opts) {
    this.element = $('<div></div>');
    $(this.element).css('background', 'rgba(10,10,10,0.09)');
    $(this.element).css('height', '1000px');
    $(this.element).css('width', '1400px');
    $(this.element).css('position', 'absolute');
    $('body').append(this.element);
    this.initialize.call(this);
}

_.extend(Puzon.prototype, Backbone.Events, {
  initialize: function(options){
    this.clock = 0;
    this.timer = setInterval(_.bind(function() {
      this.tick();
    }, this), 1000);
    this.bindAll();
  },
  tick: function() {
    this.clock++;
    console.log(this.clock);
  },
  reset: function() {
    this.clock = 0;
  },
  bindAll: function(){
    this.element.bind('click', _.bind(this.reset, this));
    $(window).scroll( _.bind(this.reset, this));
  }
})
module.exports = new Puzon();
