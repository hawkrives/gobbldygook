'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'

import {DragDropMixin} from '../../node_modules/react-dnd/dist/ReactDND.min'
import itemTypes from '../models/itemTypes'
import semesterName from '../helpers/semesterName'

let thisYear = new Date().getYear()

var Course = React.createClass({
	displayName: 'Course',
	mixins: [DragDropMixin],

	configureDragDrop(registerType) {
		registerType(itemTypes.COURSE, {
			dragSource: {
				beginDrag() {
					return {
						item: {clbid: this.props.info.clbid}
					}
				},
				endDrag(didDrop) {
					if (didDrop) {
						if (this.props.schedule) {
							console.log(
								'removing course', this.props.info.clbid,
								'from', this.props.schedule.id)
							this.props.schedule.removeCourse(this.props.info.clbid)
						}
					}
				}
			}
		})
	},

	getInitialState() {
		return {
			showTools: false
		}
	},

	showTools() {
		console.log('show tools')
		this.setState({
			showTools: true
		})
	},

	removeFromSemester() {
		this.props.schedule.removeCourse(this.props.info.clbid)
	},

	render() {
		let course = this.props.info;
		let title = course.type === 'Topic' ? course.name : course.title;

		let titleEl = React.DOM.h1({className: 'title'}, title)

		let department = React.DOM.span({className: 'department'}, course.dept)
		let number = React.DOM.span({className: 'number'}, course.num)
		let section = React.DOM.span({className: 'section'}, course.sect)
		let identifier = React.DOM.span({className: 'identifier'}, department, ' ', number, section)
		let professors = React.DOM.span({className: 'professors'}, humanize.oxford(course.profs))

		let details;
		if (this.state.showTools) {
			let semesterList = React.DOM.select({className: 'semester-select'}, _.map(this.props.semesters, s => {
				return React.DOM.option({value: s.id, key: s.id}, s.year + '-' + s.semester)
			}))
			let deleteButton = React.DOM.button({className: 'remove-course', onClick: this.removeFromSemester}, 'Remove Course')
			let tools = React.DOM.span(null, semesterList, deleteButton)
			details = React.DOM.span({className: 'details'}, tools)
		} else {
			details = React.DOM.span({className: 'details'}, identifier, professors)
		}

		let warnings = []
		if (course.year !== this.props.schedule.year && this.props.schedule.year <= thisYear) {
			warnings.push({msg: 'This course (from ' + course.year + ') is not offered in this year.'})
		}
		if (course.sem !== this.props.schedule.semester) {
			warnings.push({msg: 'This course (from ' + semesterName(course.sem) + ') is not offered in this semester.', icon: 'ios7-calendar-outline'})
		}
		if (this.props.conflicts && !_.isUndefined(this.props.index)) {
			let i = this.props.index;
			if (_.any(this.props.conflicts[i])) {
				let conflictIndex = _.findIndex(this.props.conflicts[i], item => item === true)
				conflictIndex = conflictIndex + 1; // because humans don't 0-index lists
				warnings.push({msg: 'This course has a time conflict with the ' + humanize.ordinal(conflictIndex) + ' course.', icon: 'ios7-clock-outline'})
			}
		}
		let warningEls;
		if (warnings.length) {
			// console.log(warnings, course.title, course.year, this.props.schedule.year,course.semester, this.props.schedule.semester)
			warningEls = React.DOM.span({
				title: _.map(warnings, w => '- ' + w.msg + '\n')},
				_.map(warnings, w => {
					let icon = w.icon ? w.icon : 'alert-circled';
					return React.DOM.i({className: 'ion-' + icon, key: icon})
				}))
		}

		return React.DOM.article(
			Object.assign({
				className: 'course',
				onClick: this.showTools,
			}, this.dragSourceFor(itemTypes.COURSE)),

			React.DOM.div({className: 'info-rows'}, titleEl, details),
			React.DOM.div({className: 'warnings'}, warningEls)
		);
	}
})

var EmptyCourseSlot = React.createClass({
	displayName: 'EmptyCourseSlot',
	render() {
		let title = 'Empty Slot ' + this.props.index

		let titleEl = React.DOM.h1({className: 'title'}, title)
		let details = React.DOM.span({className: 'details'}, 'no details')

		return React.DOM.article({className: 'course empty'},
			React.DOM.div({className: 'info-rows'}, titleEl, details));
	}
})

export default Course
export {EmptyCourseSlot}
