var expect = require("chai").expect;
var StudyTime = require("../src/studytime.js");
var backbone = require("backbone");
var LocalStorage = require('../src/local-storage.js');
var _ = require("underscore");
var $ = require("jquery");
var sinon = require("sinon");
describe("Initialisation", function() {
  var studyTime;
  var spy;
  beforeEach(function() {
    spy = sinon.spy(window , "addEventListener");
    spy.withArgs("click");
    spy.withArgs("scroll");
    spy.withArgs("mousemove");
    spy.withArgs("keypress");
    spy.withArgs("visibilitychange");
    studyTime = new StudyTime({
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
    expect(studyTime.element.get(0)).to.equal(window);
  });
  it('binds the event listeners to the element', function() {
    expect(spy.withArgs("click").calledOnce).to.equal(true);
    expect(spy.withArgs("scroll").calledOnce).to.equal(true);
    expect(spy.withArgs("mousemove").calledOnce).to.equal(true);
    expect(spy.withArgs("keypress").calledOnce).to.equal(true);
    expect(spy.withArgs("visibilitychange").calledOnce).to.equal(true);
  });
});
describe("handleWindowFocus", function() {
  //Phantomjs doesn't seem to support visibility api.
});
