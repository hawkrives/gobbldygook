import '6to5-core/polyfill'
import 'whatwg-fetch'

import Promise from 'bluebird'
Promise.longStackTraces()

import React from 'react'
React.initializeTouchEvents(true)

import './helpers/startNotifications'
import './helpers/bindKeys'
import './helpers/startGlobalPollution'
import './helpers/startDataLoading'
import './helpers/startRouter'
