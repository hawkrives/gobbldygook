import React, {Component, PropTypes} from 'react'

export default class CourseTitle extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		onClick: PropTypes.func,
		title: PropTypes.string,
		type: PropTypes.string,
	}

	render() {
		const {name, title, type} = this.props
		const isIndependent = /^I[RS]/.test(name)
		let courseName = title || name
		let showSubtitle = false

		if (isIndependent) {
			courseName = name
			if (courseName.length > 3) {
				courseName = courseName.substring(3)
			}
		}
		else if (type === 'Topic') {
			courseName = `${name.replace(/top.*: */gi, '')}`
			showSubtitle = true
		}
		else if (type === 'Seminar') {
			courseName = `${name.replace(/sem.*: */gi, '')}`
			showSubtitle = true
		}

		return (
			<header>
				<h1 className='title'>{courseName}</h1>
				{showSubtitle
					? <h2 className='subtitle'>{title}</h2>
					: null}
			</header>
		)
	}
}
