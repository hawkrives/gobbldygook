import Promise from 'bluebird'
Promise.longStackTraces()

import 'babel-core/polyfill'
import 'whatwg-fetch'

import React from 'react'
React.initializeTouchEvents(true)

import './index.scss'

import './start-things/bind-keys'
import './start-things/start-notifications'
import './start-things/start-global-pollution'
import './start-things/start-data-loading'
import './start-things/start-router'
