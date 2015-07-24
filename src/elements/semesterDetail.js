import React from 'react'
import Immutable from 'immutable'
import {State} from 'react-router'
import {isCurrentSemester} from 'sto-helpers'

let SemesterDetail = React.createClass({
	propTypes: {
		student: React.PropTypes.object.isRequired,
	},

	mixins: [State],

	getInitialState() {
		return {
			year: null,
			semester: null,
			schedules: Immutable.List(),
		}
	},

	componentDidMount() {
		this.componentWillReceiveProps(this.props)
	},

	componentWillReceiveProps(nextProps) {
		const {year, semester} = this.getParams()

		const schedules = nextProps.student.schedules.filter(isCurrentSemester(year, semester))
		// console.log('semesterDetail.componentWillReceiveProps', year, semester, nextProps.student.schedules.toJS())

		this.setState({year, semester, schedules})
	},

	render() {
		// console.log('SemesterDetail#render')
		return (<div className='semester-detail'>
			<pre>
				{this.getPath()}{'\n'}
				{JSON.stringify(this.state.schedules.toJS(), null, 2)}
			</pre>
		</div>)
	},
})

export default SemesterDetail
