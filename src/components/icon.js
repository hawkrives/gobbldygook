import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

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
			<svg
				className={cx('icon', this.props.className)}
				style={{...style, ...this.props.style}}
			>
				<use xlinkHref={`../icons/ionicons/${this.props.name}.svg`} />
			</svg>
		)
	}
}
