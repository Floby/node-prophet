var readline = require('readline');

module.exports = Prompt;


function Prompt () {
  var interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return function prompt (name) {
    return new Promise((resolve, reject) => {
      interface.question(name, function (value) {
        console.log('got value', value)
        resolve(value)
      })
    })
  }
}
