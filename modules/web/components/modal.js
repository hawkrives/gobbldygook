// @flow
import React from 'react'
import cx from 'classnames'
import BaseModal from 'react-modal'

import './modal.scss'

type ModalProps = {
	backdropClassName?: string,
	children?: any,
	modalClassName?: string,
	onClose: () => any,
};

export default function Modal(props: ModalProps) {
    return (
		<BaseModal
    onRequestClose={props.onClose}
    overlayClassName={cx('modal--backdrop', props.backdropClassName)}
    className={cx('modal--content', props.modalClassName)}
    isOpen={true}
    {...props}
		>
			{props.children}
		</BaseModal>
    )
}
