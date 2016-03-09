var ProphetContext = require('./lib/prophet-context')
var ValueAction = require('./lib/value-action')
var Prompt = require('./lib/prompt')

module.exports = Prophet

function Prophet (prompt, tell) {
  prompt = prompt || new Prompt()
  return Promise.resolve(new ProphetContext(prompt, tell))
}

Prophet.value = function value (name, options) {
  options = options || {}
  return Prophet.action(name, new ValueAction(name, options))
}

Prophet.action = function action (name, options) {
  var action = getActionFromOptions(options)
  return function (context) {
    return action(context)
      .then(result => context.assign({[name]: result}))
  }
}

function getActionFromOptions (options) {
  options = options || {}
  if (typeof options === 'function') options = { action: options }
  var action = options.action
  if (typeof action !== 'function') {
    throw Error('Action must be a function which returns a promise')
  }
  return action
}

