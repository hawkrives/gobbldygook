import React, {PropTypes} from 'react'
import cx from 'classnames'
import ReactModal2 from 'react-modal2'
import {Gateway} from 'react-gateway'

import './modal.scss'

export default function Modal(props) {
	return (
		<Gateway into='modal'>
			<ReactModal2
				onClose={props.onClose}
				backdropClassName={cx('modal--backdrop', props.backdropClassName)}
				modalClassName={cx('modal--content', props.modalClassName)}
			>
				{props.children}
			</ReactModal2>
		</Gateway>
	)
}

Modal.propTypes = {
	backdropClassName: PropTypes.string,
	children: PropTypes.node.isRequired,
	modalClassName: PropTypes.string,
	onClose: PropTypes.func.isRequired,
}
