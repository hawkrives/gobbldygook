import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import DocumentTitle from 'react-document-title'

import Student from '../models/student'

import Button from '../components/button'

export default class DownloadStudent extends Component {
	static propTypes = {
		className: PropTypes.string,
		student: PropTypes.instanceOf(Student).isRequired,
	}

	render() {
		return (
			<DocumentTitle title={`Download ${this.props.student.name} | Gobbldygook`}>
				<div className={cx(this.props.className)}>
					<Button>
						<a
							download={`${this.props.student.name}.gb-student.json`}
							href={`data:text/json;charset=utf-8,${this.props.student.encode()}`}>
							Download
						</a>
					</Button>
				</div>
			</DocumentTitle>
		)
	}
}
