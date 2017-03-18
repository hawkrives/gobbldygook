import React, { PropTypes } from 'react'

import Button from '../../components/button'
import Icon from '../../components/icon'
import Toolbar from '../../components/toolbar'
import Modal from '../../components/modal'
import List from '../../components/list'
import withRouter from 'react-router/lib/withRouter'
import { close } from '../../icons/ionicons'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { encodeStudent } from '../../../object-student'

const ShareModal = styled(Modal)`
    ${props => props.theme.card}
    flex-flow: column;
    padding: 1em 2em;

    & a {
        cursor: pointer;
    }
`

const WindowTools = styled(Toolbar)``

const CloseModal = styled(Button)``

export function ShareSheet(props) {
    let { student } = props
    student = student || {}

    const boundCloseModal = () =>
        props.router.push(`/s/${props.params.studentId}/`)

    const encodedStudentUrl = `data:text/json;charset=utf-8,${encodeStudent(student)}`

    return (
        <ShareModal onClose={boundCloseModal} contentLabel="Share">
            <WindowTools>
                <CloseModal onClick={boundCloseModal}>
                    <Icon>{close}</Icon>
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
