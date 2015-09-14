var expect = require("chai").expect;
var Puzon = require("../src/puzon-window.js");
var backbone = require("backbone");
var LocalStorage = require('local-puzon');
var _ = require("underscore");
var $ = require("jquery");
var sinon = require("sinon");
describe("Initialisation", function() {
  var puzon;
  var spy;
  beforeEach(function() {
    spy = sinon.spy(window , "addEventListener");
    spy.withArgs("click");
    spy.withArgs("scroll");
    spy.withArgs("mousemove");
    spy.withArgs("keypress");
    spy.withArgs("visibilitychange");
    puzon = new Puzon({
      element: window,
      idleTime: 15,
      lessonName: 'lessonOne',
      getCallback: _.bind(function(func) {
        this.callBack = func;
      }, this)
    });
  });
  afterEach(function() {
    spy.restore();
  });
  it('should be attached to the configured element', function() {
    expect(puzon.element.get(0)).to.equal(window);
  });
  it('sets the idle time to the configured value', function() {
    expect(puzon.idleTime).to.equal(15);
  });
  it('binds the event listeners to the element', function() {
    expect(spy.withArgs("click").calledOnce).to.equal(true);
    expect(spy.withArgs("scroll").calledOnce).to.equal(true);
    expect(spy.withArgs("mousemove").calledOnce).to.equal(true);
    expect(spy.withArgs("keypress").calledOnce).to.equal(true);
    expect(spy.withArgs("visibilitychange").calledOnce).to.equal(true);
  });
});

describe("tick", function() {
  var puzon;
  beforeEach(function() {
    puzon = new Puzon({
      element: window,
      idleTime: 2,
      lessonName: 'lessonOne',
      getCallback: _.bind(function(func) {
        this.callBack = func;
      }, this)
    });
  });
  afterEach(function() {

  });

  it('increments the clock', function() {
    expect(puzon.clock).to.equal(0);
    puzon.tick();
    expect(puzon.clock).to.equal(1);
  });

  it('increments the lesson timer', function() {
    puzon.lessonTimer = 0;
    puzon.tick();
    expect(puzon.lessonTimer).to.equal(1);
  });

  it('reports the times', function() {
    puzon.lessonTimer = 0;
    var spy = sinon.spy(LocalStorage, "set");
    spy.withArgs('lessonTimer', 1);
    spy.withArgs('lessonTimer', 2);
    spy.withArgs('lessonTimer', 3);
    puzon.tick();
    expect(spy.withArgs('lessonTimer', 1).called).to.equal(true);
    puzon.tick();
    expect(spy.withArgs('lessonTimer', 2).called).to.equal(true);
    puzon.tick();
    expect(spy.withArgs('lessonTimer', 3).called).to.equal(true);
  });

  it('triggers the lesson_paused event when the clock exceeds the limit', function() {
    puzon.lessonTimer = 0;
    puzon.clock = 0;
    var spy = sinon.spy(puzon, "trigger");
    puzon.tick();
    expect(spy.called).to.equal(false);
    puzon.tick();
    expect(spy.called).to.equal(false);
    puzon.tick();
    expect(spy.called).to.equal(true);
  });

  it('calls pause when the clock exceeds the limit', function() {
    puzon.lessonTimer = 0;
    puzon.clock = 0;
    var spy = sinon.spy(puzon, "pause");
    puzon.tick();
    expect(spy.called).to.equal(false);
    puzon.tick();
    expect(spy.called).to.equal(false);
    puzon.tick();
    expect(spy.called).to.equal(true);
  });
})

describe('reset', function() {
  var puzon;
  beforeEach(function() {
    puzon = new Puzon({
      element: window,
      idleTime: 2,
      lessonName: 'lessonOne',
      getCallback: _.bind(function(func) {
        this.callBack = func;
      }, this)
    });
  });
  it('sets the clock back to 0', function() {
    puzon.clock = 9;
    puzon.reset();
    expect(puzon.clock).to.equal(0);
  })
})

describe('pause', function() {
  var puzon;
  var spy;
  beforeEach(function() {
    puzon = new Puzon({
      element: window,
      idleTime: 2,
      lessonName: 'lessonOne',
      getCallback: _.bind(function(func) {
        this.callBack = func;
      }, this)
    });
  });
  it('clears the timer', function() {
    spy = sinon.spy(window, 'clearInterval');
    puzon.clock = 9;
    puzon.timer = setInterval(_.bind(function() {
    }, this), 1000);
    puzon.pause();
    expect(spy.called).to.equal(true);
    expect(puzon.clock).to.equal(0);
    expect(puzon.timer).to.equal(null);
  })
})

describe('start', function() {
  var puzon;
  var spy;
  beforeEach(function() {
    puzon = new Puzon({
      element: window,
      idleTime: 2,
      lessonName: 'lessonOne',
      getCallback: _.bind(function(func) {
        this.callBack = func;
      }, this)
    });
  });
  afterEach(function() {
    spy.restore();
  });
  it('initialises the lessonTimer to the stored value', function() {
    spy = sinon.spy(puzon, "fetchTiming");
    puzon.start();
    expect(spy.called).to.equal(true);
  });

  it('does not set a timer if one already exists', function() {
    puzon.timer = {};
    spy = sinon.spy(window, "setInterval");
    puzon.start();
    expect(spy.called).to.equal(false);
  });

  it('sets a timer if one does not already exists', function() {
    puzon.timer = undefined;
    spy = sinon.spy(window, "setInterval");
    puzon.start();
    expect(spy.called).to.equal(true);
  })
});

describe("handleWindowFocus", function() {
  //Phantomjs doesn't seem to support visibility api.
});

describe("reportTiming", function() {
  //TODO
  //(When we've plugged in a remote storage solution)
});

describe("fetchTiming", function() {
  //TODO
  //(When we've plugged in a remote storage solution)
});
