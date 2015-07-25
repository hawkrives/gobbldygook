import React from 'react'
import CourseTitle from './courseTitle'
import CourseIdentBlock from './courseIdentBlock'
import map from 'lodash/collection/map'

class CollapsedCourse extends React.Component {
	static propTypes = {
		children: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.element]),
		info: React.PropTypes.object.isRequired,
		onClick: React.PropTypes.func.isRequired,
	}

	static defaultProps = {
		onClick() {},
	}

	shouldComponentUpdate(nextProps) {
		return this.props.info.clbid !== nextProps.info.clbid
	}

	render() {
		// console.log('CollapsedCourse#render')
		let {info: course} = this.props

		let gereqs = null
		if (course.gereqs) {
			gereqs = (<ul className='gereqs'>
				{map(course.gereqs, (ge, idx) =>
					<li key={ge + idx}>{ge}</li>
				)}
			</ul>)
		}

		return (<div className='info-wrapper'>
			<div className='info-rows'>
				<CourseTitle {...course} onClick={this.props.onClick} />
				{this.props.children}
				<div className='summary'>
					<CourseIdentBlock {...course} />
					<span className='type'>{course.type}</span>
					{gereqs}
				</div>
				<div className='summary'>
					{course.times}
				</div>
			</div>
			<button className='show-info' onClick={this.props.onClick} />
		</div>)
	}
}

export default CollapsedCourse
