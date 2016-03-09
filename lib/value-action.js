module.exports = ValueAction

function ValueAction (name, options) { 
  options = options || {}
  prompt = options.prompt || `${name}?`
  accept = options.accept || /.*/
  return context => askUntilGood(context)

  function askUntilGood(context) {
    return context.prompt(prompt)
      .then(value => accept.test(value) ? value : askUntilGood(context))
  } 
}
