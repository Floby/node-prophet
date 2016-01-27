var expect = require('chai').expect
require('chai').use(require('sinon-chai'))
var sinon = require('sinon');
var Context = require('../lib/prophet-context')

describe('new ProphetContext(prompt, tell)', function () {
  var prompt, tell, context;
  beforeEach(() => prompt = sinon.spy())
  beforeEach(() => tell = sinon.spy())
  beforeEach(() => context = new Context(prompt, tell))
  it('is a constructor', function () {
    expect(context).to.be.an.instanceof(Context)
  })

  describe('.prompt(line)', function () {
    it('calls the given prompt', function () {
      context.prompt('hello?');
      expect(prompt).to.have.been.calledWith('hello?')
    })
  })

  describe('.tell(line)', function () {
    it('calls the given tell', function () {
      context.tell('hello?');
      expect(tell).to.have.been.calledWith('hello?')
    })
  })
})
