// Set up the default promise implementation as Bluebird
import Bluebird from 'bluebird'
global.Promise = Bluebird
Bluebird.config({
	warnings: {
		wForgottenReturn: false,
	},
})

// enable the regenerator runtime
import 'babel-runtime/regenerator'

// Include fetch
import 'isomorphic-fetch'

// Include React and react-dom.render
import React from 'react'
import {render} from 'react-dom'
if (DEVELOPMENT) {
	global.Perf = require('react-addons-perf')
}

// Include google analytics (in production)
import startAnalytics from './analytics'
startAnalytics()

// Kick off data loading
import loadData from './helpers/load-data'
loadData()

// Kick off the GUI
console.log('3. 2.. 1... Blast off! 🚀')

import { Router } from 'react-router'
import history from './history'
import routes from './routes'

// Create the redux store
import routerMiddleware from './redux/middleware/router'
import configureStore from './redux'
import Root from './containers/root'
const store = configureStore()
import {loadAllAreas} from './redux/areas/actions'
store.dispatch(loadAllAreas())
routerMiddleware.listenForReplays(store)

// global.store = store

render(
	(<Root store={store}>
		<Router history={history} routes={routes} />
	</Root>),
	document.getElementById('app') )
