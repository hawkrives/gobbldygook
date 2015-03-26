import React from 'react'
import studentActions from '../flux/studentActions'
import studentStore from '../flux/studentStore'

class RedoButton extends React.Component {
	render() {
		return <button
			onClick={studentActions.redo}
			disabled={studentStore.future.size === 0}>
			Redo
		</button>
	}
}

export default RedoButton
