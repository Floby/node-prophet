module.exports = Accept

function Accept (param) {
  if (param instanceof RegExp) return RegexAccept(param)
  else if (typeof param === 'function') return FunctionAccept(param)
  else return AcceptAll()
}

function RegexAccept (regex) {
  return function (value) {
    if (regex.test(value)) {
      return Promise.resolve(value)
    } else {
      return Promise.reject(Error('Should match ' + regex.toString()))
    }
  }
}

function FunctionAccept (func) {
  return function (value) {
    return Promise.resolve(value)
      .then(value => Promise.resolve(func(value)))
      .then(_ => value)
  }
}

function AcceptAll () {
  return value => Promise.resolve(value)
}
