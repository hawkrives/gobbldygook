import React from 'react'
import studentActions from 'app/flux/studentActions'
import studentStore from 'app/flux/studentStore'

let UndoButton = React.createClass({
	render() {
		return React.createElement('button', {
			onClick: studentActions.undo,
			disabled: (studentStore.history.size === 0),
		}, 'Undo')
	}
})

export default UndoButton
