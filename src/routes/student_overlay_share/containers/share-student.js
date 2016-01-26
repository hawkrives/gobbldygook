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

export default function ShareSheet(props) {
	const { student } = props

	if (!student) {
		return null
	}

	const boundCloseModal = () => props.push({pathname: `/s/${props.params.studentId}/`})


	const encoded = encodeStudent(student)

	return <Modal
		modalClassName='course course--modal'
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
				<li>Google Drive</li>
				<li>Email File</li>
				<li>Download File</li>
			</List>
		</div>

		<div>
			<Button disabled={!encoded}>
				<a
					download={`${student.name}.gb-student.json`}
					href={`data:text/json;charset=utf-8,${encoded}`}>
					Download {student.name}
				</a>
			</Button>
		</div>
	</Modal>
}

ShareSheet.propTypes = {
	params: PropTypes.shape({
		studentId: PropTypes.string.isRequired,
	}),
	student: PropTypes.object,
}

const mapDispatchToProps = dispatch => bindActionCreators({push}, dispatch)
export default connect(undefined, mapDispatchToProps)(ShareSheet)
