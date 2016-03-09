var proxyquire = require('proxyquire');
var expect = require('chai').expect
var sinon = require('sinon');

describe('prophet.value("name")', function () {
  var prophet
  var context = {}
  var action = sinon.spy()
  var expected = {}, options = {some: 'option'}
  beforeEach(function () {
    prophet = proxyquire('../', {
      './lib/value-action': function () { return action }
    })
  })
  beforeEach(() => sinon.stub(prophet, 'action').returns(() => Promise.resolve(expected)))
  afterEach(() => prophet.action.restore())

  it('delegates to prophet.action(name, {action})', function (done) {
    prophet.value('name', options)(context).then(actual => {
      expect(actual).to.equal(expected)
      expect(prophet.action).to.have.been.calledWithExactly('name', action)
      done()
    })
    .catch(done)
  })
})
