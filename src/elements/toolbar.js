import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class Toolbar {
	render() {
		return <div className={cx('toolbar', this.props.className)}>{this.props.children}</div>
	}
}
