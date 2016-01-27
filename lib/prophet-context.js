module.exports = ProphetContext

function ProphetContext (prompt, tell) {
  this.prompt = prompt || noop;
  this.tell = tell || noop;
}
function noop () {}
