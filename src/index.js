import './start-things/promises'

import 'isomorphic-fetch'

import React from 'react'
React.initializeTouchEvents(true)

import './index.scss'

import './start-things/bind-keys'
import './start-things/analytics'
import './start-things/start-notifications'
import './start-things/start-global-pollution'
import './start-things/start-data-loading'
import routes from './start-things/start-router'

// run it
console.log('3. 2.. 1... Blast off! 🚀')

React.render(routes, document.getElementById('app'))
