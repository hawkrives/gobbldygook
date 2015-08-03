import React, {Component, PropTypes} from 'react'

export default class DownloadStudent extends Component {
	static propTypes = {
		student: PropTypes.object.isRequired,
	}

	render() {
		return (
			<a className='sidebar-btn'
				download={`${this.props.student.name}.gb-student.json`}
				href={`data:text/json;charset=utf-8,${this.props.student.encode()}`}>
				Download
			</a>
		)
	}
}
