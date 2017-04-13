// @flow
import React from 'react'
import cx from 'classnames'
import './toolbar.scss'

type PropTypes = { children?: any, className?: string, style?: Object }

export default function Toolbar(props: PropTypes) {
    return (
        <div className={cx('toolbar', props.className)} style={props.style}>
            {props.children}
        </div>
    )
}
