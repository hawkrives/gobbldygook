// apply global overrides stuff here
require('babel-runtime/core-js/promise').default = require('bluebird')
global.Promise = require('bluebird')

import 'isomorphic-fetch'

import React from 'react'
React.initializeTouchEvents(true)

import './index.scss'

import './start-things/bind-keys'
import './start-things/analytics'
import './start-things/start-notifications'
import './start-things/start-global-pollution'
import './start-things/start-data-loading'
import './start-things/start-router'
