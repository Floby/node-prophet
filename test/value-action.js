var proxyquire = require('proxyquire')
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

  describe('with option accept', function () {
    var regex = /^[a-z]+$/
    var context, value, contextMock, expected = 'hey'
    var ValueAction, acceptStub, AcceptStub
    beforeEach(() => acceptStub = sinon.stub())
    beforeEach(() => AcceptStub = sinon.stub().returns(acceptStub))
    beforeEach(function () {
      ValueAction = proxyquire('../lib/value-action', {
        './accept': AcceptStub
      })
    })
    beforeEach(() => value = ValueAction('hello', { accept: regex }))
    beforeEach(() => context = new Context())
    beforeEach(() => contextMock = sinon.mock(context))
    afterEach(() => contextMock.restore())

    it('construct a new Accept(options.accept)', function () {
      expect(AcceptStub).to.have.been.calledWith(regex)
    })

    describe('when the entered value passes', function () {
      it('resolves normally', function (done) {
        contextMock.expects('prompt').withArgs('hello?').returns(Promise.resolve(expected))
        acceptStub.withArgs(expected).returns(Promise.resolve(expected))
        value(context).then(actual => {
          expect(actual).to.equal(expected)
          contextMock.verify()
          expect(acceptStub).to.have.been.calledOnce
          done()
        }).catch(done)
      })
    })

    describe('when the first values do not pass', function () {
      it('prompts until resolving', function (done) {
        acceptStub
          .withArgs('A').returns(Promise.reject(Error('should match')))
          .withArgs('B').returns(Promise.reject(Error('should match')))
          .withArgs(expected).returns(Promise.resolve(expected))
        contextMock.expects('prompt').thrice()
          .onFirstCall().returns(Promise.resolve('A'))
          .onSecondCall().returns(Promise.resolve('B'))
          .onThirdCall().returns(Promise.resolve(expected))

        value(context).then(actual => {
          expect(actual).to.equal(expected)
          contextMock.verify()
          expect(acceptStub).to.have.been.calledThrice
          done()
        }).catch(done)
      })
    })
  })
})


