import React, {Component, PropTypes} from 'react'
import StudentPicker from '../components/student-picker'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { destroyStudent } from 'src/redux/students/actions/destroy-student'
import { loadStudents } from 'src/redux/students/actions/load-students'

export default class StudentPickerContainer extends Component {
	static propTypes = {
		destroyStudent: PropTypes.func.isRequired,
		loadStudents: PropTypes.func.isRequired,
		routing: PropTypes.object.isRequired,
		students: PropTypes.object.isRequired,
	};

	state = {
		filterText: '',
		isEditing: false,
		sortBy: 'dateLastModified',
		groupBy: 'nothing',
	};

	componentWillMount() {
		this.props.loadStudents()
	}

	onFilterChange = ev => {
		this.setState({filterText: ev.target.value.toLowerCase()})
	};

	onGroupChange = () => {};

	onSortChange = () => {
		const options = ['dateLastModified', 'name', 'canGraduate']
		const currentIndex = options.indexOf(this.state.sortBy)
		const nextIndex = (currentIndex + 1) % options.length
		this.setState({sortBy: options[nextIndex]})
	};

	onToggleEditing = () => {
		this.setState({isEditing: !this.state.isEditing})
	};

	render() {
		return (
			<StudentPicker
				destroyStudent={this.props.destroyStudent}
				filterText={this.state.filterText}
				groupBy={this.state.groupBy}
				isEditing={this.state.isEditing}
				onAddStudent={this.onAddStudent}
				onFilterChange={this.onFilterChange}
				onGroupChange={this.onGroupChange}
				onOpenSearchOverlay={this.onOpenSearchOverlay}
				onSortChange={this.onSortChange}
				onToggleEditing={this.onToggleEditing}
				routing={this.props.routing}
				sortBy={this.state.sortBy}
				students={this.props.students}
			/>
		)
	}
}


const mapStateToProps = state => ({
	students: state.students,
	routing: state.routing,
})

const mapDispatchToProps = dispatch => ({
	...bindActionCreators({destroyStudent, loadStudents}, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentPickerContainer)
