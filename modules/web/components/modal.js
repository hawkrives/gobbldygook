import React, {PropTypes} from 'react'
import cx from 'classnames'
import BaseModal from 'react-modal'

import './modal.scss'

export default function Modal(props) {
	return (
		<BaseModal
			onRequestClose={props.onClose}
			overlayClassName={cx('modal--backdrop', props.backdropClassName)}
			className={cx('modal--content', props.modalClassName)}
			isOpen={true}
		>
			{props.children}
		</BaseModal>
	)
}

Modal.propTypes = {
	backdropClassName: PropTypes.string,
	children: PropTypes.node.isRequired,
	into: PropTypes.string,
	modalClassName: PropTypes.string,
	onClose: PropTypes.func.isRequired,
}
