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
