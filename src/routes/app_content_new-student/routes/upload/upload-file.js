const React = require('react')
const {Component, PropTypes} = React
const DropZone = require('react-dropzone')
import { map } from 'lodash-es'
import Button from '../../../../components/button'
import List from '../../../../components/list'
import StudentSummary from '../../../../routes/app_content_student/components/student-summary'
import { initStudent } from '../../../../redux/students/actions/init-student'
const { connect } = require('react-redux')

// import './upload-file.css'

class UploadFileScreen extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		router: PropTypes.object.isRequired,
	};

	state = {
		files: [],
		students: [],
	};

	handleFileDrop = files => {
		console.log(files)
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
		this.setState({files})
		this.convertFilesToStudents(files)
	};

	handleOpenPicker = () => {
		this.dropzone.open()
	};

	convertOneFile = file => {
		file.data.then(data => {
			let parsed
			try {
				parsed = JSON.parse(data)
			}
			catch (err) {
				return {name: file.name, error: `could not parse "${data}" because "${err.message}"`}
			}

			let converted
			try {
				converted = initStudent(parsed)
			}
			catch (err) {
				return {name: file.name, error: err.message}
			}

			return converted
		}).then(student => {
			this.setState({students: this.state.students.concat(student)})
		})
	};

	convertFilesToStudents = files => {
		this.setState({students: []})
		files.forEach(this.convertOneFile)
	};

	handleImportStudents = () => {
		this.state.students.forEach(this.props.dispatch)
		this.props.dispatch(this.props.router.push('/'))
	};

	render() {
		let {students} = this.state
		let files = this.state.files.slice(students.length)

		return (
			<div>
				<header className='header'>
					<h1>Upload a File</h1>
				</header>

				<DropZone
					ref={el => (this.dropzone = el)}
					accept='.gbstudent,.json,.gb-student'
					onDrop={this.handleFileDrop}
					multiple
					disablePreview
					className='upload-dropzone'
					activeClassName='canDrop'
					// HTML doesn't give us filenames until we drop, so it can't tell if it'll be accepted until the drop happens
					rejectClassName='canDrop'
				>
					<p>
						Just drop some students here, or click to select some to upload.
					</p>
				</DropZone>

				<List type='plain' className='upload-results'>
					{
						// eslint-disable-next-line no-confusing-arrow
						map(students, stu => stu.payload
							? <li key={stu.payload.id}><StudentSummary student={stu.payload} showMessage={false} showAvatar={false} randomizeHello /></li>
							: <li key={stu.name}>{stu.name} returned the error "{stu.error}"</li>)}
					{map(files, file => <li key={file.name}>{file.name}</li>)}
				</List>

				<Button onClick={this.handleImportStudents}>Import Students</Button>
			</div>
		)
	}
}

let mapDispatch = dispatch => ({dispatch})

export default connect(undefined, mapDispatch)(UploadFileScreen)
