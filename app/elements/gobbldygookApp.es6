'use strict';

import * as _ from 'lodash'
import * as React from 'react'

import Student from './student'
import * as demoStudent from '../../mockups/demo_student.json'
import StudentModel from '../models/studentModel'

import SearchButton from './searchButton'

let student = new StudentModel(demoStudent)
window.student = student

var GobbldygookApp = React.createClass({
	displayName: 'GobbldygookApp',
	render() {
		return React.createElement('div', null,
			React.createElement(Student, {student: student}),
			React.createElement(SearchButton, null))
	}
})

export default GobbldygookApp
