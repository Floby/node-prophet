var sinon = require('sinon');
var prophet = require('../')
var expect = require('chai').expect
require('chai').use(require('sinon-chai'))
var ProphetContext = require('../lib/prophet-context')

function testBehaviour (getSubject) {
  describe('when `action` is a function', function () {
    var subject, action, expected = 'expected'
    beforeEach(() => action = sinon.stub().returns(Promise.resolve(expected)))
    beforeEach(() => subject = getSubject('myaction', action))
    it('returns a function', function () {
      expect(subject).to.be.a('function')
    })

    describe('the returned function', function () {
      describe('called with context', function () {
        var context, promise
        beforeEach(() => context = new ProphetContext())
        beforeEach(() => promise = subject(context))
        it('calls `action(context)`', function () {
          expect(action).to.have.been.calledWith(context)
        })
        it('returns a promise', function () {
          expect(promise).to.be.an.instanceOf(Promise)
        })

        describe('when action() resolves', function () {
          it('sets the result in context', function (done) {
            promise.then(context => {
              expect(context).to.have.property('myaction')
              expect(context.myaction).to.equal(expected)
              done()
            }).catch(done)
          })
        })
      })
    })
  })

  describe('when `action` is not a function', function () {
    it('throws', function () {
      expect(() => getSubject('name', 8))
        .to.throw(/must be a function/i)
    })
  })
}

describe('prophet.action("name", action)', function () {
  function getSubject(name, action) {
    return prophet.action(name, action)
  }
  testBehaviour(getSubject)
})
describe('prophet.action("name", { action })', function () {
  function getSubject(name, action) {
    return prophet.action(name, {action})
  }
  testBehaviour(getSubject)
})

