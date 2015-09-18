var expect = require("chai").expect;
var localStorage = require('../src/local-storage.js');
var sinon = require("sinon");

describe("get", function() {
  beforeEach(function(){});
  afterEach(function(){});
  it("returns the same value from getItem as the broswer's local storage API", function() {
    var stub = sinon.stub(window.localStorage, "getItem").returns("a value");
    var value = localStorage.get('something');
    expect(value).to.equal("a value");
  });
});

describe("set", function() {
  beforeEach(function(){});
  afterEach(function(){});
  it("sets the value in the browsers local storage API", function() {
    var spy = sinon.spy(window.localStorage, "setItem");
    var value = localStorage.set('something');
    expect(spy.called).to.equal(true);
  });
});
