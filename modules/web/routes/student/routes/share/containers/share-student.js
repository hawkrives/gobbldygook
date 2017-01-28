import React, { PropTypes } from 'react'

import Button from 'modules/web/components/button'
import Icon from 'modules/web/components/icon'
import Toolbar from 'modules/web/components/toolbar'
import Modal from 'modules/web/components/modal'
import List from 'modules/web/components/list'
import withRouter from 'react-router/lib/withRouter'
import { close } from 'modules/web/icons/ionicons'

import { connect } from 'react-redux'

import { encodeStudent } from 'modules/core'

import './share-student.scss'

export function ShareSheet(props) {
  let { student } = props
  student = student || {}

  const boundCloseModal = () => props.router.push(`/s/${props.params.studentId}/`)

  return <Modal
    into="share-modal"
    modalClassName="share-dialog"
    onClose={boundCloseModal}
	>
		<Toolbar className="window-tools">
			<Button className="close-modal" onClick={boundCloseModal}>
				<Icon>{close}</Icon>
			</Button>
		</Toolbar>

		<div>
			Share "{student.name}" via:
			<List type="bullet">
				<li>Google Drive (not implemented)</li>
				<li>
					<a
  download={`${student.name}.gbstudent`}
  href={`data:text/json;charset=utf-8,${encodeStudent(student)}`}
					>
						Download file
					</a>
				</li>
			</List>
		</div>
	</Modal>
}

ShareSheet.propTypes = {
  params: PropTypes.shape({
    studentId: PropTypes.string.isRequired,
  }).isRequired,
  router: PropTypes.object.isRequired,
  student: PropTypes.object,
}

const mapState = (state, ownProps) => {
  return { student: state.students[ownProps.params.studentId].data.present }
}

export default connect(mapState)(withRouter(ShareSheet))
