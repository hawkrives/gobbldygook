// @flow
import React from 'react'
import cx from 'classnames'
import ReactModal from 'react-modal'

if (!global.TESTING) {
	ReactModal.setAppElement('#gobbldygook')
}

import './modal.scss'

type ModalProps = {
	backdropClassName?: string,
	children?: any,
	className?: string,
	onClose: () => any,
	inheritStyles?: boolean,
}

export default function Modal(props: ModalProps) {
	return (
		<ReactModal
			onRequestClose={props.onClose}
			isOpen={true}
			{...props}
			overlayClassName={cx('modal--backdrop', props.backdropClassName)}
			className={
				props.inheritStyles
					? cx('modal--content', props.className)
					: props.className
			}
		>
			{props.children}
		</ReactModal>
	)
}
