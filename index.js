var ProphetContext = require('./lib/prophet-context');
var Prompt = require('./lib/prompt')

module.exports = Prophet

function Prophet (prompt, tell) {
  prompt = prompt || new Prompt()
  return Promise.resolve(new ProphetContext(prompt, tell))
}

Prophet.value = function value (name) {
  return function (context) {
    return context.prompt(`${name}?`)
      .then(value => Object.assign(context, {[name]: value}))
  }
}
