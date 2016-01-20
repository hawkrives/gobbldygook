import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Link} from 'react-router'

import Button from '../components/button'
import Icon from '../components/icon'
import Toolbar from '../components/toolbar'
import Separator from '../components/separator'

import CourseRemovalBox from '../components/course-removal-box'

import {undo, redo} from '../redux/students/actions/undo'
import {removeCourse} from '../redux/students/actions/courses'

import './sidebar.scss'

export function Sidebar(props) {
	const { undo, redo } = props
	const studentId = props.student.data.present.id
	const canUndo = props.student.data.past.length
	const canRedo = props.student.data.future.length

	return (
		<aside className='sidebar'>
			<Toolbar className='student-buttons'>
				<Link to='/'>
					<Button title='Students'>
						<Icon name='ios-people-outline' type='block' />
					</Button>
				</Link>
				<Link to={`/s/${studentId}/search`}>
					<Button title='Search'>
						<Icon name='ios-search' type='block' />
					</Button>
				</Link>

				<Separator type='spacer' />

				<Button title='Undo' onClick={() => undo(studentId)} disabled={!canUndo}>
					<Icon name={`ios-undo${!canUndo ? '-outline' : ''}`} type='block' />
				</Button>
				<Button title='Redo' onClick={() => redo(studentId)} disabled={!canRedo}>
					<Icon name={`ios-redo${!canRedo ? '-outline' : ''}`} type='block' />
				</Button>

				<Separator type='spacer' />

				<Link to={`/s/${studentId}/share`}>
					<Button title='Share'>
						<Icon name='ios-upload-outline' type='block' />
					</Button>
				</Link>
			</Toolbar>

			<CourseRemovalBox
				onRemoveCourse={(scheduleId, clbid) => props.removeCourse(studentId, scheduleId, clbid)}
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
