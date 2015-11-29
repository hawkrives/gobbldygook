import React, {Component, PropTypes} from 'react'
import compareProps from '../helpers/compare-props'

const independentRegex = /^I[RS]/

export default class CourseTitle extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		title: PropTypes.string,
		type: PropTypes.string,
	}

	shouldComponentUpdate(nextProps) {
		return compareProps(this.props, nextProps)
	}

	render() {
		const {name, title, type} = this.props
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

		return (
			<header>
				<h1 className='title'>{courseName}</h1>
				{subtitle && subtitle.length && <h2 className='subtitle'>{subtitle}</h2>}
			</header>
		)
	}
}
