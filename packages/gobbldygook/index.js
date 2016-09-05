// Set up the default promise implementation as Bluebird
import Bluebird from 'bluebird'
Bluebird.config({
	warnings: {
		wForgottenReturn: false,
	},
})

// Enable crash tracking
PRODUCTION && require('ohcrash')('ogdR7qSuIqexx4aixXhFKlG2')

// Include fetch
import 'isomorphic-fetch'

// Include React and react-dom.render
const React = require('react')
const {render} = require('react-dom')
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

import Router from 'react-router/lib/Router'
import history from './history'
import routes from './routes'

// Create the redux store
import configureStore from './redux'
import Root from './containers/root'
const store = configureStore()
global.dispatch = store.dispatch

import { loadAllAreas } from './redux/areas/actions'
store.dispatch(loadAllAreas())

// global.store = store

let renderFunc = Root => {
	render(
		<Root store={store}>
			<Router history={history} routes={routes} />
		</Root>,
		document.getElementById('gobbldygook'))
}

renderFunc(Root)
