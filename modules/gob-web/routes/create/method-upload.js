import React from 'react'
import PropTypes from 'prop-types'

import DropZone from 'react-dropzone'
import Button from '../../components/button'
import List from '../../components/list'
import {StudentSummary} from '../../modules/student/student-summary'
import {initStudent} from '../../redux/students/actions/init-student'
import withRouter from 'react-router/lib/withRouter'
import {connect} from 'react-redux'
import debug from 'debug'
const log = debug('web:react')

import './method-upload.scss'

class UploadFileScreen extends React.Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		router: PropTypes.object.isRequired,
	}

	state = {
		files: [],
		actions: [],
	}

	handleFileDrop = files => {
		log(files)
		files = files.map(f => ({
			name: f.name,
			size: f.size,
			data: new Promise((resolve, reject) => {
				let reader = new FileReader()
				reader.onload = ev => resolve(ev.target.result)
				reader.onerror = reader.onabort = reject
				reader.readAsText(f)
			}),
		}))
		this.setState(() => ({files}), () => this.convertFilesToStudents(files))
	}

	handleOpenPicker = () => {
		this.dropzone.open()
	}

	convertOneFile = async file => {
		let data = await file.data

		let parsed
		try {
			parsed = JSON.parse(data)
		} catch (err) {
			const msg = err.message
			parsed = {
				name: file.name,
				error: `could not parse "${data}" because "${msg}"`,
			}
		}

		let converted
		try {
			converted = initStudent(parsed)
		} catch (err) {
			converted = {name: file.name, error: err.message}
		}

		this.setState(state => ({actions: [...state.actions, converted]}))
	}

	convertFilesToStudents = files => {
		this.setState(() => ({actions: []}), files.forEach(this.convertOneFile))
	}

	handleImportStudents = () => {
		this.state.actions.forEach(this.props.dispatch)
		this.props.router.push('/')
	}

	render() {
		let {actions} = this.state
		let files = this.state.files.slice(actions.length)

		return (
			<div>
				<header className="header">
					<h1>Upload a File</h1>
				</header>

				<DropZone
					ref={el => (this.dropzone = el)}
					accept=".gbstudent,.json,.gb-student"
					onDrop={this.handleFileDrop}
					multiple={true}
					disablePreview={true}
					className="upload-dropzone"
					activeClassName="canDrop"
					rejectClassName="canDrop" // HTML doesn't give us filenames until we drop, so it can't tell if it'll be accepted until the drop happens
				>
					<p>
						Just drop some students here, or click to select some to
						upload.
					</p>
				</DropZone>

				<List type="plain" className="upload-results">
					{actions.map(
						stu =>
							stu.payload ? (
								<li key={stu.payload.id}>
									<StudentSummary
										student={stu.payload}
										showMessage={false}
										showAvatar={false}
										randomizeHello
									/>
								</li>
							) : (
								<li key={stu.name}>
									{stu.name} returned the error "
									{stu.error}
									"
								</li>
							),
					)}
					{files.map(file => <li key={file.name}>{file.name}</li>)}
				</List>

				<Button onClick={this.handleImportStudents}>
					Import Students
				</Button>
			</div>
		)
	}
}

let mapDispatch = dispatch => ({dispatch})

export default connect(undefined, mapDispatch)(withRouter(UploadFileScreen))
