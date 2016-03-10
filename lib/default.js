module.exports = Default

function Default (value) {
  if (typeof value === 'function') {
    return context => Promise.resolve(context)
      .then(context => value(context))
  } else {
    return function () {
      return Promise.resolve(value)
    }
  }
}
