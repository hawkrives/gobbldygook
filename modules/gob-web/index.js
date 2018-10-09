// @flow

import '@babel/polyfill'

import 'typeface-fira-sans'
import './styles/normalize.scss'
import './styles/css-colors.scss'
import './styles/css-variables.scss'

// Include React and react-dom.render
import React from 'react'
import {render} from 'react-dom'

// Include google analytics (in production)
import startAnalytics from './analytics'
startAnalytics()

// Kick off data loading
import loadData from './workers/load-data'
loadData().catch(err => console.error(err))

// Kick off the GUI
console.log('3. 2.. 1... Blast off! 🚀')

import App from './app'

// Create the redux store
import configureStore from './redux'
import {Provider} from 'react-redux'
import Notifications from './modules/notifications'
const store = configureStore()

// for debugging
global._dispatch = store.dispatch
global._store = store

let renderFunc = chosenStore => {
	let renderEl = document.getElementById('gobbldygook')
	if (!renderEl) {
		return
	}

	render(
		<Provider store={chosenStore}>
			<>
				<App />
				<Notifications />
			</>
		</Provider>,
		renderEl,
	)
}

renderFunc(store)
