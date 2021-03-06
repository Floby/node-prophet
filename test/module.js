var expect = require('chai').expect
var ProphetContext = require('../lib/prophet-context');

describe('prophet', function () {
  it('is a function', function () {
    expect(require('..')).to.be.a('function')
  })
  it('returns a promise', function () {
    expect(require('..')()).to.be.an.instanceof(Promise)
  })
  describe('the returned promise', function () {
    it('resolves to a ProphetContext instance', function () {
      require('..')().then(actual => expect(actual).to.be.an.instanceof(ProphetContext))
    })
  })
})
