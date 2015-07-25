import React from 'react'
import cx from 'classnames'
import studentActions from '../flux/studentActions'
import studentStore from '../flux/studentStore'

class UndoButton extends React.Component {
	render() {
		// console.log('UndoButton#render')
		return (<button className={cx(this.props.className)}
			onClick={studentActions.undo}
			disabled={studentStore.history.size === 0}>Undo</button>)
	}
}

UndoButton.propTypes = {
	className: React.PropTypes.string,
}

export default UndoButton
