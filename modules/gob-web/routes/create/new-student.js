// @flow

import * as React from 'react'
import PropTypes from 'prop-types'

import './new-student.scss'

export default function NewStudent(props: {children: React.Node}) {
	return <div className="new-student">{props.children}</div>
}
