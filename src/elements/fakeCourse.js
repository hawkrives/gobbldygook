import React from 'react'

class FakeCourse extends React.Component {
	shouldComponentUpdate() {
		return false
	}

	render() {
		// console.log('FakeCourse#render')
		let titleEl = <h1 className='title'>{this.props.title}</h1>
		let details = <p className='summary'>no details</p>

		return <article className={`course ${this.props.className}`}>
			<div className='info-rows'>{titleEl}{details}</div>
		</article>
	}
}

FakeCourse.propTypes = {
	title: React.PropTypes.string.isRequired,
	className: React.PropTypes.string.isRequired,
}

export default FakeCourse
