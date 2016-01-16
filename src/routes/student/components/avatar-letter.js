import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import isString from 'lodash/lang/isString'

import './avatar-letter.scss'

export default class AvatarLetter extends Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.string,
	};

	static defaultProps = {
		value: '',
	};

	render() {
		return (
			<div className={cx('avatar-letter', this.props.className)}>
				{isString(this.props.value) ? this.props.value[0] : ''}
			</div>
		)
	}
}
