const React = require('react')
const {PropTypes} = React
const cx = require('classnames')
// import '../../../components/inline-course.css'
// import '../../../components/course-title.css'

export default function FakeCourse(props) {
	return (
		<article className={cx('course', props.className)}>
			<div className={'row'}>
				<h1 className={'title'}>{props.title}</h1>
				<p className={'summary'}>{props.details}</p>
			</div>
		</article>
	)
}

FakeCourse.propTypes = {
	className: PropTypes.string.isRequired,
	details: PropTypes.string,
	title: PropTypes.string.isRequired,
}

FakeCourse.defaultProps = {
	details: 'no details',
}
