import './start-things/promises'

import 'isomorphic-fetch'

import 'indexeddbshim'
if (typeof window !== 'undefined') {
	// https://www.npmjs.com/package/indexeddbshim#fixing-problems-in-native-indexeddb
	// forcing the shim works around problems in indexeddb impls… like iOS
	window.shimIndexedDB.__useShim()
}

import React from 'react'
React.initializeTouchEvents(true)

import './index.scss'

import './start-things/bind-keys'
import './start-things/analytics'
import './start-things/start-notifications'
import './start-things/start-global-pollution'
import './start-things/start-data-loading'
import './start-things/start-router'
