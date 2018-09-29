// @flow

import React from 'react'
import {mount} from 'enzyme'
import 'jest-styled-components'

import configureStore from '../redux'
import ReduxWrapper from '../redux-wrapper'
import App from '../app'

import debug from 'debug'
debug.enable('foo')

test('AppContainer renders', () => {
	mount(
		<ReduxWrapper store={configureStore()}>
			<App />
		</ReduxWrapper>,
	)
})
