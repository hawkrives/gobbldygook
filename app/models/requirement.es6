'use strict';

import * as _ from 'lodash'
import * as React from 'react'

var Requirement = React.createClass({
	displayName: 'Requirement',
	render() {
		// console.log('requirement render')
		return React.DOM.li({className: 'requirement'},
			React.DOM.progress({value: this.props.has, max: this.props.needs}),
			this.props.name,
			React.DOM.br(null),
			this.props.query, this.props.validCourses
		)
	}
})

export default Requirement
