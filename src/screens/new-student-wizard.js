import React, {PropTypes} from 'react'
import omit from 'lodash/object/omit'
import history from '../history'

import Button from '../components/button'
import Icon from '../components/icon'
import Modal from '../components/modal'
import Toolbar from '../components/toolbar'

import './new-student-wizard.scss'

function closeModal(location, studentId=null) {
	console.log(arguments)
	const query = omit(location.query, ['student-wizard'])
	let path = location.pathname
	if (studentId) {
		path = `/s/${studentId}/`
	}
	history.pushState(null, path, query)
}

function onCreateStudent(location, actions) {
	actions.initStudent().then(([student]) => {
		closeModal(location, student.id)
	})
}

export default function NewStudentSheet(props, context) {
	const boundCloseModal = closeModal.bind(null, context.location)

	// alright.
	// basic info,
	// then areas,
	// then schedules.

	// can be:
	// - imported from the SIS
	// - imported from an export file
	// - shared from someone else
	// - filled in manually

	// oh, so this is where that module from dan abramov comes in - the
	// one that lets you change global state when a component is rendered
	// later: why?

	const today = new Date()

	return (
		<Modal
			modalClassName='student-wizard'
			onClose={boundCloseModal}
		>
			<Toolbar className='window-tools'>
				<Button className='close-modal' onClick={boundCloseModal}>
					<Icon name='close' />
				</Button>
			</Toolbar>

			<Toolbar>
				<Button>Import from File</Button>
				<Button>Open from Google Drive</Button>
			</Toolbar>

			<div className='intro'>
				<p>Welcome to Gobbldygook!</p>
				<p>
					We can import your course information from the St.
					Olaf SIS, from an exported file, from Google Drive, or
					you can just tell us about your stuff by hand.
				</p>
			</div>

			<form className='form'>
				<div><label>Name: <input type='text' /></label></div>
				<div><label>Matriculation: <input type='year' placeholder={today.getFullYear() - 2} /></label></div>
				<div><label>Graduation: <input type='year' placeholder={today.getFullYear() + 2} /></label></div>
				<div><label>Advisor: <input type='text' /></label></div>
				<div><label>Studies: <input type='text' /></label></div>
				<div><label>Schedules: <input type='text' /></label></div>
				<div><label>Overrides: <input type='text' /></label></div>
				<div><label>Fabrications: <input type='text' /></label></div>
			</form>

			<Button onClick={() => onCreateStudent(context.location, props.actions)}>
				Create Student
			</Button>
		</Modal>
	)
}

NewStudentSheet.propTypes = {
	actions: PropTypes.objectOf(PropTypes.func).isRequired,
}

NewStudentSheet.contextTypes = {
	location: PropTypes.object,
}
