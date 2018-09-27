// @flow

import '@babel/polyfill'

// Include React and react-dom.render
import React from 'react'
import {render} from 'react-dom'

import {Editor} from './app'

let renderFunc = () => {
	let renderEl = document.getElementById('app')
	if (!renderEl) {
		return
	}

	render(<Editor />, renderEl)
}

renderFunc()
