import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Button from '../components/button'
import Icon from '../components/icon'
import Toolbar from '../components/toolbar'
import Separator from '../components/separator'

import CourseRemovalBox from '../components/course-removal-box'

import { undo, redo } from '../redux/students/actions/undo'
import { removeCourse } from '../redux/students/actions/courses'

import { iosUndo, iosUndoOutline, iosRedo, iosRedoOutline, iosSearch, iosPeopleOutline, iosUploadOutline } from '../icons/ionicons'

import './sidebar.scss'

export function Sidebar(props) {
  const { undo, redo } = props
  const studentId = props.student.data.present.id
  const canUndo = props.student.data.past.length
  const canRedo = props.student.data.future.length

  return (
		<aside className="sidebar">
			<Toolbar className="student-buttons">
				<Button link to="/" title="Students">
					<Icon type="block">{iosPeopleOutline}</Icon>
				</Button>
				<Button link to={`/s/${studentId}/search`} title="Search">
					<Icon type="block">{iosSearch}</Icon>
				</Button>

				<Separator type="spacer" />

				<Button title="Undo" onClick={() => undo(studentId)} disabled={!canUndo}>
					<Icon type="block">{!canUndo ? iosUndoOutline : iosUndo}</Icon>
				</Button>
				<Button title="Redo" onClick={() => redo(studentId)} disabled={!canRedo}>
					<Icon type="block">{!canRedo ? iosRedoOutline : iosRedo}</Icon>
				</Button>

				<Separator type="spacer" />

				<Button link to={`/s/${studentId}/share`} title="Share">
					<Icon type="block">{iosUploadOutline}</Icon>
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


const mapDispatch = dispatch => bindActionCreators({ undo, redo, removeCourse }, dispatch)

export default connect(undefined, mapDispatch)(Sidebar)
