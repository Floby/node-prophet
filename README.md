[![Build Status][travis-image]][travis-url] [![Coverage][coveralls-image]][coveralls-url]

node-prophet
==================

> CLI Wizard utility, with promises

Prophet helps you create CLI wizards for your application

Installation
------------

    npm install --save prophet-cli

Usage
-----

```javascript
var prophet = require('prophet-cli')

prophet()
  .then(firstStep)
  .then(secondStep)
  .then(lastStep)
  .then(successCallback, errorCallback)
```

Steps are just regular success handlers for promises which take a `context` object
as parameter and must return the same `context` object. They are allowed to mutate it

Prophet can help you define such steps.

```javascript
var firstStep = prophet.value('name', {
  prompt: "What's your name?",
  accept: (name) => name.length < 24,
  hint: "Your name must be under 24 letters long"
})
var secondStep = prophet.value('nickname', {
  default: ({name}) => dasherize(name).toLowerCase()
  prompt: 'What is your nickname?',
  maxTries: 3,
  accept: [/^[a-z]+$/, isNicknameTaken] // isNicknameTaken can return either a value or a promise
})
var thirdStep = prophet.action('created', {
  action: ({name, nickname}) => users.create({name, nickname}).then(user => true)
})

prophet()
  .then(firstStep) // ex. "Florent Jaby"
  .then(secondStep) // ex. "floby"
  .then(lastStep) // let's assume success
  .then(values => {
    console.log(values)
    /*
    {
      name: 'Florent Jaby',
      nickname: 'floby',
      created: true
    }
    */
  })
  .catch(error => {
    console.error(error.message)
    process.exit(1)
  })
```

You can also loop to get an array of values for example

```javascript
prophet()
  .then(prophet.loop('favourites', {
    item: prophet.value('url'),
    repeat: 3
  }))
  .then(values => {
    // values is {favourites: [{url: 'A'}, {url: 'B'}, { url: 'C'}]}
  })
```

Simple wizards can be as simple as
```javascript
prophet()
  .then(prophet.value('first name'))
  .then(prophet.value('last name'))
  .then(prophet.value('occupation'))
  .then(success)
```

Test
----

You can run the tests with `npm test`. You will need to know [mocha][mocha-url]

Contributing
------------

Anyone is welcome to submit issues and pull requests


License
-------

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016 Florent Jaby

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[travis-image]: http://img.shields.io/travis/Floby/node-prophet/master.svg?style=flat
[travis-url]: https://travis-ci.org/Floby/node-prophet
[coveralls-image]: http://img.shields.io/coveralls/Floby/node-prophet/master.svg?style=flat
[coveralls-url]: https://coveralls.io/r/Floby/node-prophet
[mocha-url]: https://github.com/visionmedia/mocha


