/* globals module */

(function redirectIfNeeded() {
	const canonicalUrl = 'https://www.stolaf.edu/people/rives/g'
	if (typeof window !== 'undefined') {
		let {protocol, hostname} = window.location
		if (hostname === 'localhost') {
			return
		}
		if (hostname !== 'www.stolaf.edu') {
			window.location = canonicalUrl
		}
		if (protocol !== 'https:') {
			window.location = canonicalUrl
		}
	}
}())

// Set up the default promise implementation as Bluebird
import Bluebird from 'bluebird'
Bluebird.config({
	warnings: {
		wForgottenReturn: false,
	},
})

// Enable crash tracking
PRODUCTION && require('ohcrash')('ogdR7qSuIqexx4aixXhFKlG2')

// enable svg <use> support in IE 9, 10, 11
import 'svgxuse'

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

import {AppContainer} from 'react-hot-loader'
import {Router} from 'react-router'
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
		<AppContainer>
			<Root store={store}>
				<Router history={history} routes={routes} />
			</Root>
		</AppContainer>,
		document.getElementById('gobbldygook'))
}

renderFunc(Root)


if (module.hot) {
	module.hot.accept('./containers/root', () => {
		let Root = require('./containers/root').default
		renderFunc(Root)
	})
}
