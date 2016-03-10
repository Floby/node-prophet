var expect = require('chai').expect
var sinon = require('sinon');
var Default = require('../lib/default')

describe('Default(string)', function () {
  it('is a function', function () {
    expect(Default('hello')).to.be.a('function')
  })

  it('resolves to the given string', function (done) {
    Default('hello')().then(actual => {
      expect(actual).to.equal('hello')
      done()
    }).catch(done)
  })
})

describe('Defaut(function)', function () {
  var func, subject
  beforeEach(() => func = sinon.stub())
  beforeEach(() => subject = Default(func))
  it('calls the given function', function (done) {
    subject().then(_ => {
      expect(func).to.have.been.called
      done()
    }).catch(done)
  })

  describe('if the function returns a value', function () {
    beforeEach(() => func.returns('hey'))
    it('resolves to that value', function (done) {
      subject().then(actual => {
        expect(actual).to.equal('hey')
        done()
      }).catch(done)
    })
  })

  describe('if the function throws an error', function () {
    beforeEach(() => func.throws(Error('hey')))
    it('rejects with the error', function (done) {
      subject().then(_ => done(Error('should fail')))
        .catch(reason => {
          expect(reason).to.match(/hey/)
          done()
        }).catch(done)
    })
  })

  describe('if the function returns a promise', function () {
    beforeEach(() => func.returns(Promise.resolve('hey')))
    it('resolves to that value', function (done) {
      subject().then(actual => {
        expect(actual).to.equal('hey')
        done()
      }).catch(done)
    })
  })
})
