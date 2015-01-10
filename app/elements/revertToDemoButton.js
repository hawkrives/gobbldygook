import React from 'react'
import studentActions from '../flux/studentActions'

let RevertStudentToDemoButton = React.createClass({
	propTypes: {
		studentId: React.PropTypes.string.isRequired,
	},

	revertToDemo() {
		console.log('load demo data')
		studentActions.resetStudentToDemo(this.props.studentId)
	},

	render() {
		return React.createElement('button',
			{
				className: 'demo-student',
				onClick: this.revertToDemo,
			},
			'Demo')
	}
})

export default RevertStudentToDemoButton
