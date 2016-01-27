var expect = require('chai').expect
require('chai').use(require('sinon-chai'))
var sinon = require('sinon');
var Context = require('../lib/prophet-context')

describe('new ProphetContext(prompt, tell)', function () {
  var prompt, tell, context;
  beforeEach(() => prompt = sinon.stub().returns('prompted'))
  beforeEach(() => tell = sinon.stub().returns('told'))
  beforeEach(() => context = new Context(prompt, tell))
  it('is a constructor', function () {
    expect(context).to.be.an.instanceof(Context)
  })

  describe('.prompt(line)', function () {
    it('calls the given prompt', function () {
      var actual = context.prompt('hello?');
      expect(prompt).to.have.been.calledWith('hello?')
      expect(actual).to.equal('prompted')
    })
  })

  describe('.tell(line)', function () {
    it('calls the given tell', function () {
      var actual = context.tell('hello?');
      expect(tell).to.have.been.calledWith('hello?')
      expect(actual).to.equal('told')
    })
  })
})
