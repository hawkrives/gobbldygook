import React from 'react'
import {oxford} from 'humanize-plus'
import CourseTitle from './courseTitle'
import map from 'lodash/collection/map'

let CollapsedCourse = React.createClass({
	propTypes: {
		info: React.PropTypes.object,
		onClick: React.PropTypes.func,
	},
	getDefaultProps() {
		return {
			onClick() {}
		}
	},
	render() {
		let course = this.props.info
		let courseName = course.name || course.title

		let gereqs = null
		if (course.gereqs)
			gereqs = <ul className='gereqs'>
				{map(course.gereqs, (ge, idx) =>
					<li key={ge + idx}>{ge}</li>
				)}
			</ul>

		return <div className='info-wrapper'>
			<div className='info-rows'>
				<CourseTitle onClick={this.props.onClick} {...this.props} />
				<div className='summary'>
					<span className='identifier'>
						{`${course.dept} ${course.num}${course.sect || ''}`}
					</span>
					<span className='type'>{course.type}</span>
					{gereqs}
				</div>
			</div>
			<button className='show-info' onClick={this.props.onClick} />
		</div>
	},
})

export default CollapsedCourse
