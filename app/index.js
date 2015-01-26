import '6to5-core/polyfill'
import 'whatwg-fetch'

import Promise from 'bluebird'
Promise.longStackTraces()

import React from 'react'
React.initializeTouchEvents(true)

import 'app/helpers/startNotifications'
import 'app/helpers/bindKeys'
import 'app/helpers/startGlobalPollution'
import 'app/helpers/startDataLoading'
import 'app/helpers/startRouter'
