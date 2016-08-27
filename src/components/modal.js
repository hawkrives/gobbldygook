import React, {PropTypes} from 'react'
import cx from 'classnames'
import ReactDumbModal from 'react-dumb-modal'

import './modal.scss'

export default function Modal(props) {
	return (
		<ReactDumbModal
			dismiss={props.onClose}
			overlayStyle={null}
			modalStyle={null}
			overlayClassName={cx('modal--backdrop', props.backdropClassName)}
			modalClassName={cx('modal--content', props.modalClassName)}
			unstyled={true}
		>
			{props.children}
		</ReactDumbModal>
	)
}

Modal.propTypes = {
	backdropClassName: PropTypes.string,
	children: PropTypes.node.isRequired,
	into: PropTypes.string.isRequired,
	modalClassName: PropTypes.string,
	onClose: PropTypes.func.isRequired,
}
