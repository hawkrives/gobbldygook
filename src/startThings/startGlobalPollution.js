// Just for use in the browser console, I swear.
import _ from 'lodash'
window.lodash = _
import includes from 'lodash/collection/includes';

import '../polyfills/details/Element.details'
import stickyfill from '../helpers/initStickyfill'
stickyfill.init()

import present from 'present'
window.present = present

import startDetailsPolyfill from '../polyfills/details/Element.details'
startDetailsPolyfill()

if (includes(location.origin, 'www.stolaf.edu'))
	document.querySelector('p').remove()
