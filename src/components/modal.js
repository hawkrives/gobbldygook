import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import ReactModal2 from 'react-modal2'
import ReactGateway from 'react-gateway'

import './modal.scss'

if (typeof window !== 'undefined') {
	ReactModal2.setApplicationElement(document.getElementById('app'))
}

export default class Modal extends Component {
	static propTypes = {
		backdropClassName: PropTypes.string,
		children: PropTypes.node.isRequired,
		modalClassName: PropTypes.string,
		onClose: PropTypes.func.isRequired,
	};

	render() {
		return (
			<ReactGateway>
				<ReactModal2
					onClose={this.props.onClose}
					backdropClassName={cx('modal--backdrop', this.props.backdropClassName)}
					modalClassName={cx('modal--content', this.props.modalClassName)}
				>
					{this.props.children}
				</ReactModal2>
			</ReactGateway>
		)
	}
}
