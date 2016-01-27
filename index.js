var ProphetContext = require('./lib/prophet-context');

module.exports = Prophet

function Prophet () {
  return Promise.resolve(new ProphetContext())
}

Prophet.value = function value (name) {
  return function (context) {
    return context.prompt(`${name}?`)
      .then(value => Object.assign(context, {name: value}))
  }
}
