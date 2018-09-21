// @flow
import React from 'react'
import * as theme from '../../theme'
import {FlatButton} from '../../components/button'
import {InlineIcon} from '../../components/icon'
import {Toolbar} from '../../components/toolbar'
import Modal from '../../components/modal'
import List from '../../components/list'
import withRouter from 'react-router/lib/withRouter'
import {close} from '../../icons/ionicons'
import styled from 'styled-components'
import {connect} from 'react-redux'
import type {HydratedStudentType} from '@gob/object-student'

import {encodeStudent} from '@gob/object-student'

const ShareModal = styled(Modal)`
	${theme.card};
	flex-flow: column;
	padding: 1em 2em;

	& a {
		cursor: pointer;
	}
`

const WindowTools = styled(Toolbar)``

const CloseModal = styled(FlatButton)``

type PropTypes = {
	params: {
		studentId: string,
	},
	router: Object,
	student?: HydratedStudentType,
}

export function ShareSheet(props: PropTypes) {
	let {student} = props

	const boundCloseModal = () =>
		props.router.push(`/s/${props.params.studentId}/`)

	if (!student) {
		return (
			<ShareModal onClose={boundCloseModal} contentLabel="Share">
				<WindowTools>
					<CloseModal onClick={boundCloseModal}>
						<InlineIcon>{close}</InlineIcon>
					</CloseModal>
				</WindowTools>

				<p>No student given?</p>
			</ShareModal>
		)
	}

	let encodedStudent = encodeStudent(student)
	let encodedStudentUrl = `data:text/json;charset=utf-8,${encodedStudent}`

	return (
		<ShareModal onClose={boundCloseModal} contentLabel="Share">
			<WindowTools>
				<CloseModal onClick={boundCloseModal}>
					<InlineIcon>{close}</InlineIcon>
				</CloseModal>
			</WindowTools>

			<div>
				Share "{student.name}" via:
				<List type="bullet">
					<li>Google Drive (not implemented)</li>
					<li>
						<a
							download={`${student.name}.gbstudent`}
							href={encodedStudentUrl}
						>
							Download file
						</a>
					</li>
				</List>
			</div>
		</ShareModal>
	)
}

const mapState = (state, ownProps): {student: Object} => {
	return {student: state.students[ownProps.params.studentId].data.present}
}

export default connect(mapState)(withRouter(ShareSheet))
