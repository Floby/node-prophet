var expect = require('chai').expect
var Prompt = require('../lib/prompt')
var sinon = require('sinon')
var readline = require('readline')
var EventEmitter = require('events').EventEmitter

describe('prompt(name)', function () {
  var rlMock, prompt
  beforeEach(() => {
    rlMock = new EventEmitter()
    rlMock.question = sinon.spy()
  })
  beforeEach(() => sinon.stub(readline, 'createInterface').returns(rlMock))
  beforeEach(() => prompt = new Prompt())
  afterEach(() => readline.createInterface.restore())

  it('returns a promise', function () {
    expect(prompt('name')).to.be.a.instanceof(Promise)
  })

  it('calls readline.question(name)', function() {
    prompt('name');
    expect(rlMock.question).to.have.been.calledWith('name ')
  })

  describe('the returned promise', function () {
    it('resolve to the value entered by the user', function (done) {
      rlMock.question = sinon.stub().callsArgWith(1, 'some value')
      prompt('name')
        .then(actual => expect(actual).to.equal('some value'))
        .then(done.bind(null, null))
        .catch(done)
    })
  })
})
