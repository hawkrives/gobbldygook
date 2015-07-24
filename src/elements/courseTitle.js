import React from 'react'

export default class CourseTitle extends React.Component {
	static propTypes = {
		name: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func,
		title: React.PropTypes.string,
		type: React.PropTypes.string,
	}

	static defaultProps = {
		onClick() {},
	}

	shouldComponentUpdate(nextProps) {
		return this.props.name !== nextProps.name && this.props.title !== nextProps.title
	}

	render() {
		const {name, title, type} = this.props
		const isIndependent = /^I[RS]/.test(name)
		let courseName = title || name

		if (isIndependent) {
			courseName = name
			if (courseName.length > 3) {
				courseName = courseName.substring(3)
			}
		}
		else if (type === 'Topic') {
			courseName = name
			courseName = courseName.replace(/top.*: */gi, '')
		}

		return <h1 className='title'>{courseName}</h1>
	}
}

export default CourseTitle
