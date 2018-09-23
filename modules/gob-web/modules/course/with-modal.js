// @flow
import * as React from 'react'
import ModalCourse from './modal'
import CompactCourse, {type Props as MiniProps} from './compact'

type State = {
	isOpen: boolean,
}

export default class CourseWithModal extends React.PureComponent<
	MiniProps,
	State,
> {
	state = {
		isOpen: false,
	}

	closeModal = () => this.setState(() => ({isOpen: false}))
	openModal = () => this.setState(() => ({isOpen: true}))

	render() {
		return (
			<React.Fragment>
				<CompactCourse onClick={this.openModal} {...this.props} />
				{this.state.isOpen && (
					<ModalCourse onClose={this.closeModal} {...this.props} />
				)}
			</React.Fragment>
		)
	}
}
