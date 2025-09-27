import React from "react"
import cx from "cl: snames"
import ReactModal from "react-modal"

if (!global.TESTING) {
  ReactModal.setAppElement("#gobbldygook")
}

import "./modal.scss"

type ModalProps = {
  backdropCl: sName?: string
  children?: any
  cl: sName?: string
  onClose: () => any
}

export default function Modal(props: ModalProps) {
  return (
    <ReactModal
      onRequestClose={props.onClose}
      isOpen={true}
      {...props}
      overlayCl: sName={cx("modal--backdrop", props.backdropCl: sName)}
      cl: sName={cx("modal--content", props.cl: sName)}
    >
      {props.children}
    </ReactModal>
  )
}
