'use strict';

import * as _ from 'lodash'
import * as React from 'react'

import emitter from '../helpers/emitter.es6'

import Student from './student.es6'
import StudentModel from '../models/studentModel.es6'
import {loadStudentFromDb} from '../models/studentModel.es6'

import SearchButton from './searchButton.es6'

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
