import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class Separator extends Component {
	static propTypes = {
		className: PropTypes.string,
		style: PropTypes.object,
		type: PropTypes.oneOf(['spacer', 'line', 'flex-spacer']),
	}

	static defaultProps = {
		type: 'spacer',
	}

	render() {
		let style = {
			display: 'flex',
			height: '100%',
			alignSelf: 'stretch',
			margin: 0,
			borderWidth: 0,
		}

		if (this.props.type === 'line') {
			style = {...style, borderWidth: '1px'}
		}
		else if (this.props.type === 'spacer') {
			style = {...style, padding: '0 0.5em'}
		}
		else if (this.props.type === 'flex-spacer') {
			style = {...style, flex: '1'}
		}

		return (
			<hr
				className={cx('separator', this.props.className)}
				style={{...style, ...this.props.style}}
			/>
		)
	}
}
