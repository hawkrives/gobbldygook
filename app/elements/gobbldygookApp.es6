'use strict';

import * as _ from 'lodash'
import * as React from 'react'

import Student from './student'
import * as demoStudent from '../../mockups/demo_student.json'
import StudentModel from '../models/studentModel'

import SearchButton from './searchButton'

let student = new StudentModel(demoStudent)
window.student = student

var Gobbldygook = React.createClass({
	render() {
		return React.DOM.div(null,
			Student({student: student}),
			SearchButton())
	}
})

export default Gobbldygook
