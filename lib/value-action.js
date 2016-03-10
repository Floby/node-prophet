var Accept = require('./accept')
var Default = require('./default')


module.exports = ValueAction

function ValueAction (name, options) { 
  options = options || {}
  var prompt = ((hint) => options.prompt || `${name}${hint}?`)
  var accept = Accept(options.accept || /.*/)
  var defaultValue = Default(options.default)
  return context => askUntilGood(context)

  function askUntilGood(context) {
    return promptUserOrUseDefault(context)
      .then(value => accept(value)
        .catch(reason => askUntilGood(context)))
  } 

  function promptUserOrUseDefault (context) {
    return defaultValue(context)
      .then(value => value ? ` (${value})` : '')
      .then(hint => context.prompt(prompt(hint)))
      .then(value => value !== '' ? value : defaultValue(context))
  }
}
