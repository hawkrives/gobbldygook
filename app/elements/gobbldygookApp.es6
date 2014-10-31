'use strict';

import * as _ from 'lodash'
import * as React from 'react'

import emitter from '../helpers/emitter'

import Student from './student'
import StudentModel from '../models/studentModel'
import {loadStudentFromDb} from '../models/studentModel'

import SearchButton from './searchButton'

let student = loadStudentFromDb()

var GobbldygookApp = React.createClass({
	displayName: 'GobbldygookApp',
	getInitialState() {
		return {
			student: student
		}
	},
	render() {
		emitter.on('loadedStudent', student => this.setState({student}))
		return React.createElement('div', null,
			React.createElement(Student, {student: this.state.student}),
			React.createElement(SearchButton, null))
	}
})

export default GobbldygookApp
