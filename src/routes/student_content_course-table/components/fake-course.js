import React, {Component, PropTypes} from 'react'

export default class FakeCourse extends Component {
	static propTypes = {
		className: PropTypes.string.isRequired,
		details: PropTypes.string,
		title: PropTypes.string.isRequired,
	};

	static defaultProps = {
		details: 'no details',
	};

	render() {
		// console.log('FakeCourse#render')
		return (
			<article className={`course course--inline ${this.props.className}`}>
				<div className='info-rows'>
					<h1 className='title'>{this.props.title}</h1>
					<p className='summary'>{this.props.details}</p>
				</div>
			</article>
		)
	}
}
