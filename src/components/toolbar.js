import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import './toolbar.scss'

export default class Toolbar extends Component {
	static propTypes = {
		children: PropTypes.any.isRequired,
		className: PropTypes.string,
		style: PropTypes.object,
	};

	render() {
		return (
			<div className={cx('toolbar', this.props.className)} style={this.props.style}>
				{this.props.children}
			</div>
		)
	}
}
