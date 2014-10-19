'use strict';

import * as _ from 'lodash'
import * as React from 'react'

import Student from './student'
// import {NotificationCenter} from './toast'

var Gobbldygook = React.createClass({
	render() {
		return React.DOM.div(
			null,
			// NotificationCenter({flux: this.props.flux}),
			Student({flux: this.props.flux})
		)
	}
})

export default Gobbldygook
