import React, {PropTypes} from 'react'
import cx from 'classnames'
import ReactModal2 from 'react-modal2'
import ReactGateway from 'react-gateway'

import './modal.scss'

if (typeof window !== 'undefined') {
	ReactModal2.setApplicationElement(document.getElementById('app'))
}

export default function Modal(props) {
	return (
		<ReactGateway>
			<ReactModal2
				onClose={props.onClose}
				backdropClassName={cx('modal--backdrop', props.backdropClassName)}
				modalClassName={cx('modal--content', props.modalClassName)}
			>
				{props.children}
			</ReactModal2>
		</ReactGateway>
	)
}

Modal.propTypes = {
	backdropClassName: PropTypes.string,
	children: PropTypes.node.isRequired,
	modalClassName: PropTypes.string,
	onClose: PropTypes.func.isRequired,
}
