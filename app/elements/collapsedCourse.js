import React from 'react'
import {oxford} from 'humanize-plus'
import CourseTitle from './courseTitle'
import map from 'lodash/collection/map'

class CollapsedCourse extends React.Component {
	render() {
		console.log('CollapsedCourse#render')
		let {info: course} = this.props

		let gereqs = null
		if (course.gereqs) {
			gereqs = <ul className='gereqs'>
				{map(course.gereqs, (ge, idx) =>
					<li key={ge + idx}>{ge}</li>
				)}
			</ul>
		}

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
	}
}

CollapsedCourse.propTypes = {
	info: React.PropTypes.object.isRequired,
	onClick: React.PropTypes.func.isRequired,
}
CollapsedCourse.defaultProps = {
	onClick() {}
}

export default CollapsedCourse
