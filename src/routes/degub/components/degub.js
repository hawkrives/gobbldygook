import React, { PropTypes } from 'react'
import map from 'lodash/collection/map'
import size from 'lodash/collection/size'
import { connect } from 'react-redux'
import { ActionTypes } from 'redux-undo'
import { loadStudents } from '../../../redux/students/actions'

function Student({undo, redo, student}) {
	const canUndo = 'past' in student && student.past.length
	const canRedo = 'future' in student && student.future.length
	const present = student.present

	return (
		<div>
			<button disabled={!canUndo} onClick={undo} style={{color: canUndo ? '#444' : '#888'}}>
				Undo
			</button>
			<button disabled={!canRedo} onClick={redo} style={{color: canRedo ? '#444' : '#888'}}>
				Redo
			</button>
			{' '}
			<code>{present.id}</code> {present.name}
		</div>
	)
}


function Degub(props) {
	const students = props.students.data
	const isLoading = props.students.isLoading
	console.log('degub.render', isLoading, size(students))
	if (isLoading) {
		return <div>Loading students…</div>
	}

	return (
		<ul className={`degub ${props.className || ''}`}>
			{map(students, (s, i) =>
				<li key={i}>
					<Student
						student={s}
						undo={() => props.undo(s.present.id)}
						redo={() => props.redo(s.present.id)}
					/>
				</li>)}
		</ul>
	)
}

Degub.propTypes = {
	className: PropTypes.string,
	redo: PropTypes.func.isRequired,
	students: PropTypes.object.isRequired,
	undo: PropTypes.func.isRequired,
}

Degub.defaultProps = {
	actions: {},
	students: {},
}


class DegubContainer extends React.Component {
	static propTypes = {
		loadStudents: PropTypes.func.isRequired,
	};
	componentWillMount() {
		this.props.loadStudents()
	}
	render() {
		return <Degub {...this.props} />
	}
}


const mapStateToProps = state => ({
	students: state.students,
})

const mapDispatchToProps = dispatch => ({
	undo: id => dispatch({type: ActionTypes.UNDO, payload: {studentId: id}}),
	redo: id => dispatch({type: ActionTypes.REDO, payload: {studentId: id}}),
	loadStudents: () => dispatch(loadStudents()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DegubContainer)
