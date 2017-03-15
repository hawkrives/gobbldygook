// @flow

import React from 'react'
import { mount } from 'enzyme'

import configureStore from '../redux'
import ReduxWrapper from '../redux-wrapper'
import Router from 'react-router/lib/Router'
import { createMemoryHistory } from 'history'
import routes from '../routes'

import debug from 'debug'
debug.enable('foo')

test('AppContainer renders', () => {
    mount(
        <ReduxWrapper store={configureStore()}>
            <Router history={createMemoryHistory()} routes={routes} />
        </ReduxWrapper>
    )
})

test('AppContainer can navigate to /create', () => {
    const store = configureStore()
    const history = createMemoryHistory()

    const app = mount(
        <ReduxWrapper store={store}>
            <Router history={history} routes={routes} />
        </ReduxWrapper>
    )

    history.push('/create')

    expect(app.find('h1').text()).toEqual('Hi there!')
})
