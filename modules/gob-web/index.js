// @flow

import '@babel/polyfill'

import 'typeface-fira-sans'
import './styles/normalize.scss'
import './styles/css-colors.scss'
import './styles/css-variables.scss'

import debug from 'debug'
const log = debug('web')

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
log('3. 2.. 1... Blast off! 🚀')

import App from './app'

// Create the redux store
import configureStore from './redux'
import ReduxWrapper from './redux-wrapper'
const store = configureStore()

// for debugging
global._dispatch = store.dispatch
global._store = store

let renderFunc = Root => {
	let renderEl = document.getElementById('gobbldygook')
	if (!renderEl) {
		return
	}

	render(
		<Root store={store}>
			<App />
		</Root>,
		renderEl,
	)
}

renderFunc(ReduxWrapper)
