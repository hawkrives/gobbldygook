const React = require('react')
const {PropTypes} = React
const cx = require('classnames')
const ReactDumbModal = require('react-dumb-modal')

// import './modal.css'

export default function Modal(props) {
	return (
		<ReactDumbModal
			dismiss={props.onClose}
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
