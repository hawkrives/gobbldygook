const React = require('react')
const {PropTypes} = React
// import './course-title.css'

const independentRegex = /^I[RS]/

function processTitle({name, title, type}) {
	const isIndependent = independentRegex.test(name)
	let courseName = title || name
	let subtitle = undefined

	if (isIndependent) {
		courseName = name
		if (courseName.length > 3) {
			courseName = courseName.substring(3)
		}
	}
	else if (type === 'Topic') {
		courseName = `${name.replace(/top.*: */gi, '')}`
		subtitle = title
	}
	else if (type === 'Seminar') {
		courseName = title
		subtitle = name
	}

	return {courseName, subtitle}
}

export default function CourseTitle({name, title, type, className}) {
	let {courseName, subtitle} = processTitle({name, title, type})
	return (
		<div className={className}>
			<h1 className='course-title'>{courseName}</h1>
			{subtitle && subtitle.length && <h2 className='course-subtitle'>{subtitle}</h2>}
		</div>
	)
}

CourseTitle.propTypes = {
	className: PropTypes.string,
	name: PropTypes.string.isRequired,
	title: PropTypes.string,
	type: PropTypes.string,
}
