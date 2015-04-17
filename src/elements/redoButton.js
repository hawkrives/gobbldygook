import React from 'react'
import cx from 'classnames'
import studentActions from '../flux/studentActions'
import studentStore from '../flux/studentStore'

class RedoButton extends React.Component {
	render() {
		console.log('RedoButton#render')
		return <button className={cx(this.props.className)}
			onClick={studentActions.redo}
			disabled={studentStore.future.size === 0}>Redo</button>
	}
}

RedoButton.propTypes = {
	className: React.PropTypes.string,
}

export default RedoButton
