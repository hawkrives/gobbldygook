// @flow
import React from 'react'
import cx from 'classnames'
import ReactModal from 'react-modal'

import './modal.scss'

type ModalProps = {
    backdropClassName?: string,
    children?: any,
    className?: string,
    onClose: () => any,
};

export default function Modal(props: ModalProps) {
    return (
        <ReactModal
            onRequestClose={props.onClose}
            isOpen={true}
            {...props}
            overlayClassName={cx('modal--backdrop', props.backdropClassName)}
            className={cx('modal--content', props.className)}
        >
            {props.children}
        </ReactModal>
    )
}
