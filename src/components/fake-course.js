import React, {Component, PropTypes} from 'react'

export default class FakeCourse extends Component {
	static propTypes = {
		className: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
	}

	render() {
		// console.log('FakeCourse#render')
		return (
			<article className={`course ${this.props.className}`}>
				<div className='info-rows'>
					<h1 className='title'>{this.props.title}</h1>
					<p className='summary'>no details</p>
				</div>
			</article>
		)
	}
}
