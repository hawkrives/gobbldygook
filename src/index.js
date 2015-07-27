import Promise from 'bluebird'
Promise.longStackTraces()

import 'babel-core/polyfill'
import 'whatwg-fetch'

import React from 'react'
React.initializeTouchEvents(true)

import './styles/app.scss'

import './helpers/bindKeys'
import './startThings/startNotifications'
import './startThings/startGlobalPollution'
import './startThings/startDataLoading'
import './startThings/startRouter'
