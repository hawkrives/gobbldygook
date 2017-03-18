// @flow

// Include fetch
import 'whatwg-fetch'

import debug from 'debug'
const log = debug('web')

// Include React and react-dom.render
const React = require('react')
const { render } = require('react-dom')
if (process.env.NODE_ENV !== 'production') {
    global.Perf = require('react-addons-perf')
}

// Include google analytics (in production)
import startAnalytics from './analytics'
startAnalytics()

// Kick off data loading
import loadData from './helpers/load-data'
import isSafari from 'is-safari'
if (isSafari) {
    global.useNetworkOnly = true
}
loadData().catch(err => console.error(err))

// Kick off the GUI
log('3. 2.. 1... Blast off! 🚀')

import Router from 'react-router/lib/Router'
import history from './history'
import routes from './routes'

// Create the redux store
import configureStore from './redux'
import ReduxWrapper from './redux-wrapper'
const store = configureStore()

import { loadAllAreas } from './redux/areas/actions'
store.dispatch(loadAllAreas())

// for debugging
global._dispatch = store.dispatch
global._store = store

let renderFunc = Root => {
    render(
        <Root store={store}>
            <Router history={history} routes={routes} />
        </Root>,
        document.getElementById('gobbldygook')
    )
}

renderFunc(ReduxWrapper)
