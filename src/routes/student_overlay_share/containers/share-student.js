import React, {PropTypes} from 'react'

import Button from 'src/components/button'
import Icon from 'src/components/icon'
import Toolbar from 'src/components/toolbar'
import Modal from 'src/components/modal'
import List from 'src/components/list'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import encodeStudent from 'src/helpers/encode-student'

import './share-student.css'

export function ShareSheet(props) {
	let { student } = props
	student = student || {}

	const boundCloseModal = () => props.push(`/s/${props.params.studentId}/`)

	return <Modal
		into='share-modal'
		modalClassName='share-dialog'
		onClose={boundCloseModal}
	>
		<Toolbar className='window-tools'>
			<Button className='close-modal' onClick={boundCloseModal}>
				<Icon name='close' />
			</Button>
		</Toolbar>

		<div>
			Share "{student.name}" via:
			<List type='bullet'>
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
	push: PropTypes.func.isRequired,
	student: PropTypes.object,
}

const mapState = (state, ownProps) => {
	return {student: state.students[ownProps.params.studentId].data.present}
}
const mapDispatch = dispatch => bindActionCreators({push}, dispatch)
export default connect(mapState, mapDispatch)(ShareSheet)
