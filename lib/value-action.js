var Accept = require('./accept');

module.exports = ValueAction

function ValueAction (name, options) { 
  options = options || {}
  prompt = options.prompt || `${name}?`
  accept = Accept(options.accept || /.*/)
  return context => askUntilGood(context)

  function askUntilGood(context) {
    return context.prompt(prompt)
      .then(value => accept(value))
      .catch(reason => askUntilGood(context))
  } 
}
