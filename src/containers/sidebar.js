const React = require('react')
const {PropTypes} = React
const {connect} = require('react-redux')
import {bindActionCreators} from 'redux/es'

import Button from '../components/button'
import Icon from '../components/icon'
import Toolbar from '../components/toolbar'
import Separator from '../components/separator'

import CourseRemovalBox from '../components/course-removal-box'

import {undo, redo} from '../redux/students/actions/undo'
import {removeCourse} from '../redux/students/actions/courses'

// import './sidebar.css'

export function Sidebar(props) {
	const { undo, redo } = props
	const studentId = props.student.data.present.id
	const canUndo = props.student.data.past.length
	const canRedo = props.student.data.future.length

	return (
		<aside className='sidebar'>
			<Toolbar className='student-buttons'>
				<Button link to='/' title='Students'>
					<Icon name='ios-people-outline' type='block' />
				</Button>
				<Button link to={`/s/${studentId}/search`} title='Search'>
					<Icon name='ios-search' type='block' />
				</Button>

				<Separator type='spacer' />

				<Button title='Undo' onClick={() => undo(studentId)} disabled={!canUndo}>
					<Icon name={`ios-undo${!canUndo ? '-outline' : ''}`} type='block' />
				</Button>
				<Button title='Redo' onClick={() => redo(studentId)} disabled={!canRedo}>
					<Icon name={`ios-redo${!canRedo ? '-outline' : ''}`} type='block' />
				</Button>

				<Separator type='spacer' />

				<Button link to={`/s/${studentId}/share`} title='Share'>
					<Icon name='ios-upload-outline' type='block' />
				</Button>
			</Toolbar>

			<CourseRemovalBox
				removeCourse={(scheduleId, clbid) => props.removeCourse(studentId, scheduleId, clbid)}
			/>

			{props.children}
		</aside>
	)
}

Sidebar.propTypes = {
	children: PropTypes.node.isRequired,
	redo: PropTypes.func.isRequired,
	removeCourse: PropTypes.func.isRequired,
	student: PropTypes.shape({
		data: PropTypes.shape({
			past: PropTypes.array.isRequired,
			present: PropTypes.object.isRequired,
			future: PropTypes.array.isRequired,
		}).isRequired,
	}).isRequired,
	undo: PropTypes.func.isRequired,
}


const mapDispatch = dispatch => bindActionCreators({undo, redo, removeCourse}, dispatch)

export default connect(undefined, mapDispatch)(Sidebar)
