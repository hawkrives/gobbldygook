import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

import './loading.scss'

export default class Loading extends Component {
	static propTypes = {
		children: PropTypes.any,
		className: PropTypes.string,
	}

	render() {
		return (
			<figure className='loading…'>
				<div className='loading-spinner'><div /></div>
				{/*<div dangerouslySetInnerHTML={{__html: atob(require('../images/ion-loader-android.svg').substr('data:image/svg+xml;base64,'.length))}} />*/}
				<figcaption className={cx('loading-message', this.props.className)}>
					{this.props.children}
				</figcaption>
			</figure>
		)
	}
}
