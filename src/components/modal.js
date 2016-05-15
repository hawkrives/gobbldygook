import React, {PropTypes} from 'react'
import cx from 'classnames'
import ReactModal2 from 'react-modal2'
import {Gateway} from 'react-gateway'

import './modal.css'

export default function Modal(props) {
	return (
		<Gateway into={props.into}>
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
	into: PropTypes.string.isRequired,
	modalClassName: PropTypes.string,
	onClose: PropTypes.func.isRequired,
}
