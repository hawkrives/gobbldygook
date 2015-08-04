import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class Modal extends Component {
	static propTypes = {
		children: PropTypes.any.isRequired,
		className: PropTypes.string,
	}

	render() {
		return (
			<div className={cx('modal', this.props.className)}>
				{this.props.children}
			</div>
		)
	}
}
