import React, {Component, PropTypes} from 'react'
import map from 'lodash/collection/map'
import cx from 'classnames'

import CourseTitle from './course-title'
import CourseIdentBlock from './course-ident-block'

export default class BasicCourse extends Component {
	static propTypes = {
		children: PropTypes.node,
		className: PropTypes.string,
		course: PropTypes.object.isRequired,
		onClick: PropTypes.func,
	}

	static defaultProps = {
		className: 'info-wrapper',
	}

	render() {
		const {course} = this.props

		return (
			<div className={cx(this.props.className)}>
				<div className='info-rows'>
					<CourseTitle {...course} onClick={this.props.onClick} />
					{this.props.children}
					<div className='summary'>
						<CourseIdentBlock {...course} />
						<span className='type'>{course.type}</span>
						{course.gereqs
							? <ul className='gereqs'>
								{map(course.gereqs, (ge, idx) =>
									<li key={ge + idx}>{ge}</li>
								)}
							</ul>
							: null}
						{course.prerequisites
							? <span className='has-prerequisite' title={course.prerequisites}>!</span>
							: null}
					</div>
					<div className='summary'>
						{course.times}
					</div>
				</div>
			</div>
		)
	}
}
