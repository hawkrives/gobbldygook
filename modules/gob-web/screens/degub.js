import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import {connect} from 'react-redux'
import {undo, redo} from '../redux/students/actions/undo'
import {loadStudents} from '../redux/students/actions/load-students'

function Student({undo, redo, student}) {
	if (student.isLoading) {
		return <div>Loading student…</div>
	}

	const canUndo = student.past.length
	const canRedo = student.future.length
	const present = student.present

	return (
		<div>
			<button
				disabled={!canUndo}
				onClick={undo}
				style={{color: canUndo ? '#444' : '#888'}}
			>
				Undo
			</button>
			<button
				disabled={!canRedo}
				onClick={redo}
				style={{color: canRedo ? '#444' : '#888'}}
			>
				Redo
			</button>{' '}
			<code>{present.id}</code> {present.name}
		</div>
	)
}

Student.propTypes = {
	redo: PropTypes.func.isRequired,
	student: PropTypes.object.isRequired,
	undo: PropTypes.func.isRequired,
}

function Degub(props) {
	const students = props.students || []

	return (
		<ul className={`degub ${props.className || ''}`}>
			{map(students, (s, i) => (
				<li key={i}>
					<Student
						student={s}
						undo={() => props.undo(s.present.id)}
						redo={() => props.redo(s.present.id)}
					/>
				</li>
			))}
		</ul>
	)
}

Degub.propTypes = {
	className: PropTypes.string,
	redo: PropTypes.func.isRequired,
	students: PropTypes.object.isRequired,
	undo: PropTypes.func.isRequired,
}

class DegubContainer extends React.Component {
	static propTypes = {
		loadStudents: PropTypes.func.isRequired,
	}
	componentDidMount() {
		this.props.loadStudents()
	}
	render() {
		return <Degub {...this.props} />
	}
}

export default connect(
	state => ({students: state.students}),
	{undo, redo, loadStudents},
)(DegubContainer)
