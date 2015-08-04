import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import {Navigation} from 'react-router'

import actions from '../flux/student-actions'

import Loading from '../components/loading'

export default React.createClass({
	mixins: [Navigation],

	render() {
		// actions.initStudent()

		return <Loading>Creating student…</Loading>
	},
})
