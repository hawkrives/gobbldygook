import Promise from 'bluebird'
Promise.longStackTraces()

import 'babel-core/polyfill'
import 'whatwg-fetch'

import React from 'react'
React.initializeTouchEvents(true)

// styles
import './styles/app.scss'

// vendor things that aren't on npm (yet)
/* eslint Stretchy:true */
import '../vendor/stretchy/stretchy.js'
Stretchy.selectors.filter = '.stretchy'

import './helpers/bindKeys'
import './startThings/startNotifications'
import './startThings/startGlobalPollution'
import './startThings/startDataLoading'
import './startThings/startRouter'
