import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

import actions from '../flux/student-actions'
import Loading from '../components/loading'

export default class CreateStudent extends Component {
	render() {
		// actions.initStudent()

		return <Loading>Creating student…</Loading>
	}
}
