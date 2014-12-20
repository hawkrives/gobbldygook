import * as React from 'react'

var Requirement = React.createClass({
	render() {
		// console.log('requirement render')
		return React.createElement('li', {className: 'requirement'},
			React.createElement('progress', {value: this.props.has, max: this.props.needs}),
			this.props.name,
			React.createElement('br', null),
			this.props.query, this.props.validCourses
		)
	}
})

export default Requirement
