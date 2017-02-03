import React, { PropTypes } from 'react'

import Button from '../../../../../components/button'
import Icon from '../../../../../components/icon'
import Toolbar from '../../../../../components/toolbar'
import Modal from '../../../../../components/modal'
import List from '../../../../../components/list'
import withRouter from 'react-router/lib/withRouter'
import { close } from '../../../../../icons/ionicons'

import { connect } from 'react-redux'

import { encodeStudent } from '../../../../../../object-student'

import './share-student.scss'

export function ShareSheet(props) {
	let { student } = props
	student = student || {}

	const boundCloseModal = () => props.router.push(`/s/${props.params.studentId}/`)

	return <Modal
		modalClassName="share-dialog"
		onClose={boundCloseModal}
		contentLabel="Share"
	>
		<Toolbar className="window-tools">
			<Button className="close-modal" onClick={boundCloseModal}>
				<Icon>{close}</Icon>
			</Button>
		</Toolbar>

		<div>
			Share "{student.name}" via:
			<List type="bullet">
				<li>Google Drive (not implemented)</li>
				<li>
					<a
						download={`${student.name}.gbstudent`}
						href={`data:text/json;charset=utf-8,${encodeStudent(student)}`}
					>
						Download file
					</a>
				</li>
			</List>
		</div>
	</Modal>
}

ShareSheet.propTypes = {
	params: PropTypes.shape({
		studentId: PropTypes.string.isRequired,
	}).isRequired,
	router: PropTypes.object.isRequired,
	student: PropTypes.object,
}

const mapState = (state, ownProps) => {
	return { student: state.students[ownProps.params.studentId].data.present }
}

export default connect(mapState)(withRouter(ShareSheet))
