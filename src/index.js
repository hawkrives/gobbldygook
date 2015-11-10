import './start-things/promises'

import 'isomorphic-fetch'

import './index.scss'

import './start-things/bind-keys'
import './start-things/analytics'
import './start-things/start-notifications'
import './start-things/start-global-pollution'
import './start-things/start-data-loading'
import routes from './start-things/start-router'

// run it
console.log('3. 2.. 1... Blast off! 🚀')

import React from 'react'
import {render} from 'react-dom'
import Router from 'react-router'

Router.run(routes, (Handler, state) => {
	render(React.createElement(Handler, {routerState: state}), document.getElementById('app'))
})
