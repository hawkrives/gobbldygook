import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import DocumentTitle from 'react-document-title'

import Button from '../components/button'

export default class DownloadStudent extends Component {
	static propTypes = {
		className: PropTypes.string,
		student: PropTypes.object,
	}

	render() {
		const student = this.props.student
			? this.props.student.encode()
			: false

		return (
			<DocumentTitle title={`Download ${this.props.student.name} | Gobbldygook`}>
				<div className={cx(this.props.className)}>
					<Button disabled={!student}>
						<a
							download={`${this.props.student.name}.gb-student.json`}
							href={`data:text/json;charset=utf-8,${student}`}>
							Download
						</a>
					</Button>
				</div>
			</DocumentTitle>
		)
	}
}
