import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class Loading extends Component {
	static propTypes = {
		children: PropTypes.any,
		className: PropTypes.string,
	}

	render() {
		return (
			<figure className='loading…'>
				<div className='loading-spinner'><div /></div>
				<figcaption className={cx('loading-message', this.props.className)}>
					{this.props.children}
				</figcaption>
			</figure>
		)
	}
}
