import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class Loading extends Component {
	static propTypes = {
		className: PropTypes.string,
		message: PropTypes.string.isRequired,
	}

	render() {
		return (
			<figure className='loading…'>
				<div className='loading-spinner'><div /></div>
				<figcaption className={cx('loading-message', this.props.className)}>
					{this.props.message}
				</figcaption>
			</figure>
		)
	}
}
