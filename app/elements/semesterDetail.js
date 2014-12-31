import * as React from 'react'
import * as Immutable from 'immutable'
import {State} from 'react-router'
import {isCurrentSemester} from 'app/helpers/isCurrent'

let SemesterDetail = React.createClass({
	mixins: [State],

	propTypes: {
		student: React.PropTypes.object.isRequired,
	},

	getInitialState: function() {
		return {
			year: null,
			semester: null,
			schedules: Immutable.List(),
		};
	},

	componentWillReceiveProps(nextProps) {
		let params = this.getParams()
		let {year, semester} = params

		let schedules = nextProps.student.schedules.filter(isCurrentSemester(year, semester))
		console.log('semester.componentWillReceiveProps', year, semester, nextProps.student.schedules.toJS())

		this.setState({year, semester, schedules})
	},

	componentDidMount() {
		this.componentWillReceiveProps(this.props)
	},

	render() {
		return React.createElement('div',
			{className: 'semester-detail'},
			JSON.stringify(this.getPath()),
			JSON.stringify(this.state.schedules.toJS()))
	},
})

export default SemesterDetail
