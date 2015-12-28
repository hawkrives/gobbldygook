import React, {PropTypes} from 'react'
import cx from 'classnames'
import DocumentTitle from 'react-document-title'

import encodeStudent from '../helpers/encode-student'
import Button from '../components/button'

export default function DownloadStudent(props) {
	const student = encodeStudent(props.student)

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
DownloadStudent.propTypes = {
	className: PropTypes.string,
	student: PropTypes.object.isRequired,
}
