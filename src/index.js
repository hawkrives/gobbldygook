// Set up the default promise implementation as Bluebird
import Bluebird from 'bluebird'
global.Promise = Bluebird
require('babel-runtime/core-js/promise').default = Bluebird

// Include fetch
import 'isomorphic-fetch'

// Include other polyfills
// import startDetailsPolyfill from './polyfills/details/Element.details'
// startDetailsPolyfill()
// Add debug to window
window.DEBUG = require('debug')

// Include React and react-dom.render
import React from 'react'
import {render} from 'react-dom'

// Include google analytics (in production)
import './start/analytics'

// Set up a "history" object for react-router
import history from './history'

// Kick off data loading
import loadData from './helpers/load-data'
loadData()

// Kick off the GUI
console.log('3. 2.. 1... Blast off! 🚀')

import { Router } from 'react-router'
import routes from './routes'

import configureStore from './ducks/store/configure-store'
import Root from './containers/root'
const store = configureStore()

if (process.env.NODE_ENV !== 'production') {
	typeof window !== 'undefined' && (window.Perf = require('react-addons-perf'))
}

import { loadStudents } from './ducks/actions/students'
import { loadAreas } from './ducks/actions/areas'
store.dispatch(loadStudents())
store.dispatch(loadAreas())

render(
	(<Root store={store}>
		<Router history={history}>
			{routes}
		</Router>
	</Root>),
	document.getElementById('app') )
