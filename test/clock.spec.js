var expect = require("chai").expect;
var Clock = require("../src/clock.js");
var backbone = require("backbone");
var LocalStorage = require('../src/local-storage.js');
var _ = require("underscore");
var $ = require("jquery");
var sinon = require("sinon");
describe("Initialisation", function() {

});

describe("tick", function() {
  var clock;
  beforeEach(function() {
    clock = new Clock({
      idleTime: 2
    });
  });
  afterEach(function() {

  });

  it('increments the clock', function() {
    expect(clock.times.inactiveTimer).to.equal(0);
    clock.tick();
    expect(clock.times.inactiveTimer).to.equal(1);
  });

  it('increments the lesson timer', function() {
    clock.times.lessonTimer = 0;
    clock.tick();
    expect(clock.times.lessonTimer).to.equal(1);
  });

  it('reports the times', function() {
    clock.times.lessonTimer = 0;
    var spy = sinon.spy(LocalStorage, "set");
    spy.withArgs('lessonTimer', 1);
    spy.withArgs('lessonTimer', 2);
    spy.withArgs('lessonTimer', 3);
    clock.tick();
    expect(spy.withArgs('lessonTimer', 1).called).to.equal(true);
    clock.tick();
    expect(spy.withArgs('lessonTimer', 2).called).to.equal(true);
    clock.tick();
    expect(spy.withArgs('lessonTimer', 3).called).to.equal(true);
  });

  it('triggers the lesson_paused event when the clock exceeds the limit', function() {
    clock.times.lessonTimer = 0;
    clock.times.inactiveTimer = 0;
    var spy = sinon.spy(clock, "trigger");
    clock.tick();
    expect(spy.called).to.equal(false);
    clock.tick();
    expect(spy.called).to.equal(false);
    clock.tick();
    expect(spy.called).to.equal(true);
  });

  it('calls pause when the clock exceeds the limit', function() {
    clock.times.lessonTimer = 0;
    clock.times.inactiveTimer = 0;
    var spy = sinon.spy(clock, "pause");
    clock.tick();
    expect(spy.called).to.equal(false);
    clock.tick();
    expect(spy.called).to.equal(false);
    clock.tick();
    expect(spy.called).to.equal(true);
  });
})

describe('reset', function() {
  var clock;
  beforeEach(function() {
    clock = new Clock({
      idleTime: 2
    });
  });
  it('sets the clock back to 0', function() {
    clock.times.inactiveTimer = 9;
    clock.reset();
    expect(clock.times.inactiveTimer).to.equal(0);
  })
})

describe('pause', function() {
  var clock;
  var spy;
  beforeEach(function() {
      clock = new Clock({
        idleTime: 2
      });
  });
  it('clears the timer', function() {
    spy = sinon.spy(window, 'clearInterval');
    clock.times.inactiveTimer = 9;
    clock.clocks.mainClock = setInterval(_.bind(function() {
    }, this), 1000);
    clock.pause();
    expect(spy.called).to.equal(true);
    expect(clock.times.inactiveTimer).to.equal(0);
    expect(clock.clocks.mainClock).to.equal(null);
  })
})

describe('start', function() {
  var clock;
  var spy;
  beforeEach(function() {
      clock = new Clock({
        idleTime: 2
      });
  });
  afterEach(function() {
    spy.restore();
  });
  it('initialises the lessonTimer to the stored value', function() {
    spy = sinon.spy(clock, "fetchTiming");
    clock.start();
    expect(spy.called).to.equal(true);
  });

  it('does not set a timer if one already exists', function() {
    clock.timer = {};
    spy = sinon.spy(window, "setInterval");
    clock.start();
    expect(spy.called).to.equal(false);
  });

  it('sets a timer if one does not already exists', function() {
    clock.timer = undefined;
    spy = sinon.spy(window, "setInterval");
    clock.start();
    expect(spy.called).to.equal(true);
  })
});

describe("reportTiming", function() {
  //TODO
  //(When we've plugged in a remote storage solution)
});

describe("fetchTiming", function() {
  //TODO
  //(When we've plugged in a remote storage solution)
});
