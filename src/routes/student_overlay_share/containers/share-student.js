import React, {PropTypes} from 'react'

import Button from '../../../components/button'
import Icon from '../../../components/icon'
import Toolbar from '../../../components/toolbar'
import Modal from '../../../components/modal'
import List from '../../../components/list'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import encodeStudent from '../../../helpers/encode-student'

import styles from './share-student.scss'

export function ShareSheet(props) {
	let { student } = props
	student = student || {}

	const boundCloseModal = () => props.push(`/s/${props.params.studentId}/`)

	return <Modal
		into='share-modal'
		modalClassName={styles.dialog}
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
