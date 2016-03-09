var expect = require('chai').expect
var ValueAction = require('../lib/value-action')
var sinon = require('sinon');
var Context = require('../lib/prophet-context')

describe('new ValueAction("name")', function () {
  it('returns a function', function () {
    expect(new ValueAction('name')).to.be.a('function')
  })
  describe('the returned function', function () {
    describe('called with (context)', function () {
      var context, value, contextMock, expected = {}
      beforeEach(() => value = ValueAction('name'))
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
        it('resolves to that value', function (done) {
          value(context).then(actual => {
            expect(actual).to.equal(expected)
            done()
          }).catch(done)
        })
      })
    })
  })

  describe('with option prompt=something fancy', function () {
    var context, value, contextMock, expected = {}
    beforeEach(() => value = ValueAction('hello', {prompt: 'something'}))
    beforeEach(() => context = new Context())
    beforeEach(() => contextMock = sinon.mock(context))
    afterEach(() => contextMock.restore())
    beforeEach(() => contextMock.expects('prompt').withArgs('something').returns(Promise.resolve(expected)))
    it('calls prompt(something fancy) instead', function () {
      value(context)
      contextMock.verify()
    })

    it('still resolves the resulting value', function (done) {
      value(context).then(actual => {
        expect(actual).to.equal(expected)
        done()
      }).catch(done)
    })
  })

  describe('with options accept=<regex>', function () {
    var regex = /^[a-z]+$/
    var context, value, contextMock, expected = 'hey'
    beforeEach(() => value = ValueAction('hello', { accept: regex }))
    beforeEach(() => context = new Context())
    beforeEach(() => contextMock = sinon.mock(context))
    afterEach(() => contextMock.restore())
    describe('when the entered value matches', function () {
      it('resolves normally', function (done) {
        contextMock.expects('prompt').withArgs('hello?').returns(Promise.resolve(expected))
        value(context).then(actual => {
          expect(actual).to.equal(expected)
          contextMock.verify()
          done()
        }).catch(done)
      })
    })

    describe('when the first value does not match', function () {
      it('prompts again before resolving', function (done) {
        contextMock.expects('prompt').thrice()
          .onFirstCall().returns(Promise.resolve('SOMETHING THAT DOES NOT MATCH'))
          .onSecondCall().returns(Promise.resolve('SOMETHING THAT DOES NOT MATCH'))
          .onThirdCall().returns(Promise.resolve(expected))

        value(context).then(actual => {
          expect(actual).to.equal(expected)
          contextMock.verify()
          done()
        }).catch(done)
      })
    })
  })
})


