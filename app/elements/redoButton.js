import React from 'react'
import studentActions from '../flux/studentActions'
import studentStore from '../flux/studentStore'

let RedoButton = React.createClass({
	render() {
		return React.createElement('button', {
			onClick: studentActions.redo,
			disabled: (studentStore.future.size === 0),
		}, 'Redo')
	}
})

export default RedoButton
