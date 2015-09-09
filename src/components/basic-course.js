import React, {Component, PropTypes} from 'react'
import map from 'lodash/collection/map'

import Button from './button'
import CourseTitle from './course-title'
import CourseIdentBlock from './course-ident-block'
import Icon from './icon'

export default class BasicCourse extends Component {
	static propTypes = {
		children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
		course: PropTypes.object.isRequired,
		onClick: PropTypes.func,
	}

	render() {
		const course = this.props.course

		return (
			<div className='info-wrapper'>
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
					</div>
					<div className='summary'>
						{course.times}
					</div>
				</div>
				<Button className='show-info'
					onClick={this.props.onClick}
					title='Show course information'>
					<Icon name='ionicon-information-circled' type='block' />
				</Button>
			</div>
		)
	}
}
