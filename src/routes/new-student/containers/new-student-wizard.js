import React, {PropTypes} from 'react'
import forEach from 'lodash/collection/forEach'
import DropZone from 'react-dropzone'

import Button from '../components/button'
import List from '../components/list'

import './new-student-wizard.scss'

function onCreateStudent(router, actions) {
	actions.initStudent().then(([student]) => {
		router.replace(`/s/${student.id}/`)
	})
}

const onDrop = (actions, files) => {
	forEach(files, file => {
		const reader = new FileReader()

		reader.addEventListener('load', upload => {
			actions.importStudent({
				data: upload.target.result,
				type: file.type,
			})
		})

		reader.readAsText(file)
	})
}

let dropZoneRef

export default function NewStudentScreen(props, context) {
	return (
		<DropZone
			className='student-wizard'
			activeClassName='student-wizard-can-drop'
			ref={ref => dropZoneRef = ref}
			disableClick
			accept='application/json'
			onDrop={files => onDrop(props.actions, files)}
		>
			<div>
			<header className='introduction'>
				<h1 className='title'>Hi there!</h1>
				<h2 className='subtitle'>I don't know anything about you. Care to enlighten me?</h2>
			</header>

			<div className='intro-page'>
				<p>
					You're welcome to manually type in all of your
					information, but we can just pull in your information
					from the SIS. Alternately, if you've used Gobbldygook
					before, we can import your data from a file, or from
					Google Drive.
				</p>


				<List type='plain' className='button-container'>
					<li><Button disabled type='raised'>Import from the SIS</Button></li>
					<li><Button disabled type='raised'>Manually</Button></li>
					<li><Button disabled type='raised'>Import from Google Drive</Button></li>
					<li><Button disabled type='raised' onClick={() => dropZoneRef.open()}>Import from a file</Button></li>
				</List>
			</div>
			{/*<div>
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
			</div>*/}

			<p>
				Does everything look alright?<br/>
				<Button
					type='raised'
					onClick={() => onCreateStudent(context.router, props.actions)}
				>
					Let's go!
				</Button>
			</p>
			</div>
		</DropZone>
	)
}

NewStudentScreen.propTypes = {
	actions: PropTypes.objectOf(PropTypes.func),
}

NewStudentScreen.contextTypes = {
	router: PropTypes.object.isRequired,
}
