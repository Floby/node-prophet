module.exports = Accept

function Accept (regex) {
  return function (value) {
    if (regex.test(value)) {
      return Promise.resolve(value)
    } else {
      return Promise.reject(Error('Should match ' + regex.toString()))
    }
  }
}
