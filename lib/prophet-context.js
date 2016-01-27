module.exports = ProphetContext

function ProphetContext (prompt, tell) {
  Object.defineProperty(this, '_prompt', {value: prompt || noop})
  Object.defineProperty(this, '_tell', {value: tell || noop})
}
ProphetContext.prototype.prompt = function () {
  return this._prompt.apply(this, arguments)
}
ProphetContext.prototype.tell = function () {
  return this._tell.apply(this, arguments)
}
function noop () {}
