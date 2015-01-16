// Just for use in the browser console, I swear.
import _ from 'lodash'
window.lodash = _

// Handy debugging function
window.log = (...args) => console.log(...args)

import stickyfill from  './initStickyfill'
stickyfill.init()
