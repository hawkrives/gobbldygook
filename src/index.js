import 'lie/polyfill'

import 'babel-core/polyfill'
import 'whatwg-fetch'

import React from 'react'
React.initializeTouchEvents(true)

// import {Parse} from 'parse'
// if (process.env.NODE_ENV === 'production') {
// 	window.Parse = Parse
// 	Parse.initialize('3YmZ7OaEPjPzP7yg19Wts1VGYmVr2qCw36nZIDYD', 'lWmcTJJ7ADHlHh5pTWudTiimBODHy3lEUYz5vlnG')
// 	Parse.Analytics.track('load', {browser: navigator.userAgent})
// }

import './index.scss'

import './start-things/bind-keys'
import './start-things/start-notifications'
import './start-things/start-global-pollution'
import './start-things/start-data-loading'
import './start-things/start-router'
