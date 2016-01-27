var expect = require('chai').expect
var prophet = require('../index')
var sinon = require('sinon');
var Context = require('../lib/prophet-context')

describe('prophet.value("name")', function () {
  it('returns a function', function () {
    expect(prophet.value('name')).to.be.a('function')
  })
  describe('the returned function', function () {
    describe('called with (context)', function () {
      var context, value, contextMock, expected = {}
      beforeEach(() => value = prophet.value('name'))
      beforeEach(() => context = new Context())
      beforeEach(() => contextMock = sinon.mock(context))
      afterEach(() => contextMock.restore())
      beforeEach(() => contextMock.expects('prompt').withArgs('name?').returns(Promise.resolve(expected)))
      it('returns a promise', function () {
        expect(value(context)).to.be.an.instanceof(Promise)
      })
      it('calls prompt("name?")', function () {
        value(context)
        contextMock.verify()
      })

      describe('when prompt resolves to a value', function () {
        it('returns a promise to that value', function () {
          value(context).then(actual => expect(actual).to.equal(expected))
        })
      })
    })
  })
})
