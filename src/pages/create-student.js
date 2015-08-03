import React, {Component, PropTypes} from 'react'
import {Navigation} from 'react-router'
import cx from 'classnames'

import LoadingScreen from './loadingScreen'

import actions from '../flux/studentActions'


export default React.createClass({
	mixins: [Navigation],

	render() {
		// actions.initStudent()

		return <LoadingScreen message='Creating student…' />
	}
})
