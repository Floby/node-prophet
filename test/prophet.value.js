var expect = require('chai').expect
var prophet = require('../')
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
        it('returns a promise to the context', function (done) {
          value(context).then(actual => {
            expect(actual).to.equal(context)
            done()
          }).catch(done)
        })
        it('has created the field name=value on the context', function (done) {
          value(context).then(actual => {
            expect(actual).to.have.property('name')
            expect(actual.name).to.equal(expected)
            done()
          }).catch(done)
        })
      })
    })
  })

  describe('with option prompt=something fancy', function () {
    var context, value, contextMock, expected = {}
    beforeEach(() => value = prophet.value('hello', {prompt: 'something'}))
    beforeEach(() => context = new Context())
    beforeEach(() => contextMock = sinon.mock(context))
    afterEach(() => contextMock.restore())
    beforeEach(() => contextMock.expects('prompt').withArgs('something').returns(Promise.resolve(expected)))
    it('calls prompt(something fancy instead)', function () {
      value(context)
      contextMock.verify()
    })

    it('still sets the resulting value to name', function (done) {
      value(context).then(actual => {
        expect(actual).to.have.property('hello')
        expect(actual.hello).to.equal(expected)
        done()
      }).catch(done)
    })
  })
})

