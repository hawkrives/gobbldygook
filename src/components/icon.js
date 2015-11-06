import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

import iconsList from './icons-list.json'
import './icon.scss'

export default class Icon extends Component {
	static propTypes = {
		className: PropTypes.string,
		name: PropTypes.string.isRequired,
		style: PropTypes.object,
		type: PropTypes.oneOf(['block', 'inline']).isRequired,
	}

	static defaultProps = {
		type: 'inline',
	}

	render() {
		const style = {
			display: this.props.type === 'inline' ? 'inline-block' : 'block',
		}

		return (
			<span
				className={cx('icon', this.props.className)}
				style={{...style, ...this.props.style}}>
				{iconsList[this.props.name]}
			</span>
		)
	}
}
