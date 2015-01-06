import * as React from 'react'
import * as Immutable from 'immutable'
import {State} from 'react-router'
import {isCurrentSemester} from 'app/helpers/isCurrent'

let SemesterDetail = React.createClass({
	mixins: [State],

	propTypes: {
		student: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			year: null,
			semester: null,
			schedules: Immutable.List(),
		}
	},

	componentWillReceiveProps(nextProps) {
		let params = this.getParams()
		let {year, semester} = params

		let schedules = nextProps.student.schedules.filter(isCurrentSemester(year, semester))
		// console.log('semesterDetail.componentWillReceiveProps', year, semester, nextProps.student.schedules.toJS())

		this.setState({year, semester, schedules})
	},

	componentDidMount() {
		this.componentWillReceiveProps(this.props)
	},

	render() {
		return React.createElement('div',
			{className: 'semester-detail'},
			React.createElement('pre', null,
				this.getPath(), '\n',
				JSON.stringify(this.state.schedules.toJS(), null, 2)))
	},
})

export default SemesterDetail
