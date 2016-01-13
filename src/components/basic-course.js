import React, {Component, PropTypes} from 'react'
import map from 'lodash/collection/map'
import cx from 'classnames'

import CourseTitle from './course-title'
import buildCourseIdent from '../helpers/build-course-ident'
import compareProps from '../helpers/compare-props'

export default class BasicCourse extends Component {
	static propTypes = {
		children: PropTypes.node,
		className: PropTypes.string,
		course: PropTypes.object.isRequired,
	};

	static defaultProps = {
		className: 'info-wrapper',
	};

	shouldComponentUpdate(nextProps) {
		return compareProps(this.props, nextProps)
	}

	render() {
		const { course } = this.props

		return (
			<div className={cx(this.props.className)}>
				<div className='info-rows'>
					<CourseTitle title={course.title} name={course.name} type={course.type} />
					{this.props.children}
					<div className='summary'>
						<span className='identifier'>
							{buildCourseIdent(course)}
						</span>
						<span className='type'>{course.type}</span>
						{course.gereqs && <ul className='gereqs'>
							{map(course.gereqs, (ge, idx) =>
								<li key={ge + idx}>{ge}</li>
							)}
						</ul>}
						{course.prerequisites &&
							<span className='has-prerequisite' title={course.prerequisites}>!</span>}
					</div>
					<div className='summary'>
						{course.times}
					</div>
				</div>
			</div>
		)
	}
}
