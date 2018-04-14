import React from 'react'
import PropTypes from 'prop-types'

import './new-student.scss'

export default function NewStudent(props) {
    return <div className="new-student">{props.children}</div>
}

NewStudent.propTypes = {
    children: PropTypes.node.isRequired,
}
