var expect = require('chai').expect
var sinon = require('sinon');
var Accept = require('../lib/accept')

describe('Accept(regex)', function () {
  it('is a function', function () {
    expect(Accept(/.*/)).to.be.a('function')
  })

  describe('when called with a matching value', function () {
    it('resolves to that value', function (done) {
      Accept(/hello/)('hello').then(actual => {
        expect(actual).to.equal('hello')
        done()
      }).catch(done)
    })
  })

  describe('when called with a non matching value', function () {
    it('rejects with a reason', function (done) {
      Accept(/hello/)('goodbye').then(_ => done(Error('should not resolve')))
        .catch(reason => {
          expect(reason).to.match(/should match/i)
          done()
        })
        .catch(done)
    })
  })
})

describe('Accept(function)', function () {
  var func, accept, value = 'hello'
  beforeEach(() => func = sinon.stub())
  beforeEach(() => accept = Accept(func))

  describe('when the function succeeds synchronously', function () {
    describe('by returning the value', function () {
      beforeEach(() => func.returns(value))
      it('resolves to the value', function (done) {
        accept(value).then(actual => {
          expect(actual).to.equal(value)
          done()
        }).catch(done)
      })
    })

    describe('by returning undefined', function () {
      beforeEach(() => func.returns())
      it('resolves to the value', function (done) {
        accept(value).then(actual => {
          expect(actual).to.equal(value)
          done()
        }).catch(done)
      })
    })
  })

  describe('when the function fails synchronously', function () {
    describe('by throwing an error', function () {
      var error = Error('some error')
      beforeEach(() => func.throws(error))
      it('rejects with that error', function (done) {
        accept(value).then(_ => done(Error('should fail')))
          .catch(reason => {
            expect(reason).to.equal(error)
            done()
          })
          .catch(done)
      })
    })
  })

  describe('when the function returns a promise', function () {
    describe('which resolve to the value', function () {
      beforeEach(() => func.returns(Promise.resolve(value)))
      it('resolves', function (done) {
        accept(value).then(actual => {
          expect(actual).to.equal(value)
          done()
        }).catch(done)
      })
    })

    describe('which resolve to undefined', function () {
      beforeEach(() => func.returns(Promise.resolve()))
      it('resolves', function (done) {
        accept(value).then(actual => {
          expect(actual).to.equal(value)
          done()
        }).catch(done)
      })
    })

    describe('which rejects with reason', function () {
      var error = Error('some error')
      beforeEach(() => func.returns(Promise.reject(error)))
      it('rejects', function (done) {
        accept(value).then(_ => done(Error('should fail')))
          .catch(reason => {
            expect(reason).to.equal(error)
            done()
          }).catch(done)
      })
    })
  })
})

describe('Accept(falsy)', function () {
  it('always resolves to the given value', function (done) {
    var all = [
      resolvesToValue(Accept(undefined)),
      resolvesToValue(Accept('')),
      resolvesToValue(Accept(null)),
      resolvesToValue(Accept()),
      resolvesToValue(Accept(false)),
      resolvesToValue(Accept(0))
    ]
    Promise.all(all).then(_ => done()).catch(done)
  })

  function resolvesToValue (accept) {
    return accept('hey')
      .then(value => {
        expect(value).to.equal('hey')
      })
  }
})
