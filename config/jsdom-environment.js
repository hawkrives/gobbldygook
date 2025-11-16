// Custom Jest environment to add structuredClone support to jsdom
// Required for fake-indexeddb v5+
// See: https://github.com/dumbmatter/fakeIndexedDB#jsdom-often-used-with-jest

const JSDOMEnvironment = require("jest-environment-jsdom").default

class FixJSDOMEnvironment extends JSDOMEnvironment {
  constructor(...args) {
    super(...args)

    // Add structuredClone from Node.js to the jsdom global
    // https://github.com/jsdom/jsdom/issues/3363
    this.global.structuredClone = structuredClone
  }
}

module.exports = FixJSDOMEnvironment
