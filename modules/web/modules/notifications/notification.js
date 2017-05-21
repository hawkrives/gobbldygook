// @flow
import React from 'react'
import round from 'lodash/round'
import Button from '../../components/button'
import ProgressBar from '../../components/progress-bar'
import './notification.scss'
import debug from 'debug'
const log = debug('web:react')

type NotificationProps = {
    hideButton?: boolean,
    max: number,
    message: string,
    onClose: () => any,
    type: string,
    value: number,
}

export default function Notification(props: NotificationProps) {
    log('Notification#render')
    const progressBar =
        props.type === 'progress' &&
        <div className="progress-container">
            <ProgressBar value={props.value} max={props.max} />
            <output>{round(props.value / props.max * 100, 0)}%</output>
        </div>

    return (
        <li
            className={`notification-capsule notification-type--${props.type}`}
            onClick={props.onClose}
        >
            <div className="notification-content">
                <h1 className="notification-message">
                    {props.message}
                </h1>
                {progressBar}
            </div>
            {!props.hideButton &&
                <Button
                    className="close-notification"
                    type="flat"
                    title="Close"
                >
                    ×
                </Button>}
        </li>
    )
}
