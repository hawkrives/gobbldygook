import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class Toolbar {
    static propTypes = {
        children: PropTypes.any.isRequired,
        className: PropTypes.string,
    }

	render() {
		return <div className={cx('toolbar', this.props.className)}>{this.props.children}</div>
	}
}
