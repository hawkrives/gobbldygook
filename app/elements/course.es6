'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'

import {DragDropMixin} from 'react-dnd'
import itemTypes from '../models/itemTypes'
import semesterName from '../helpers/semesterName'

function findSemesterList() {
	return [
		{id: 1, title: 'Fall 2012-13'},
		{id: 2, title: 'Interim 2012-13'},
		{id: 3, title: 'Spring 2012-13'},
	];
}


let CourseTitle = React.createClass({
	displayName: 'CourseTitle',
	render() {
		let course = this.props.info;

		///////
		let titleText = course.title;
		let courseName = course.name || course.title;
		if (course.type === 'Topic')
			titleText = courseName.substr(5, courseName.length - 1);

		let courseType = React.createElement('span', {className: 'type'}, this.props.info.type)
		let title = React.createElement('h1',
			{className: 'title'},
			this.props.info.type === 'Research' ? null : courseType,
			titleText)

		return title;
	}
})


var ExpandedCourse = React.createClass({
	displayName: 'ExpandedCourse',

	removeFromSemester() {
		this.props.schedule.removeCourse(this.props.info.clbid)
	},

	render() {
		let course = this.props.info;
		let tools = [];

		///////

		let title = React.createElement(CourseTitle, _.extend({}, this.props));

		let identifier = React.createElement('span',
			{className: 'identifier'},
			course.dept, ' ', course.num, course.sect);

		let professors = React.createElement('span',
			{className: 'professors'},
			humanize.oxford(course.profs));

		let summary = React.createElement('p',
			{className: 'summary'},
			identifier, professors);

		///////

		let offerings = React.createElement('p',
			{className: 'offerings'},
			course.times)

		let gereqs = React.createElement('ul',
			{className: 'gereqs'},
			_.map(course.gereqs, ge => React.createElement('li',
				{key: ge}, ge)))

		let description = React.createElement('p',
			{className: 'description'},
			course.desc)

		let credits = React.createElement('span',
			{className: 'credits'},
			course.credits + ' ' + humanize.pluralize(course.credits, 'credit'))

		let classInstanceOffered = React.createElement('span',
			{className: 'instance'},
			semesterName(course.sem) + ' ' + course.year)

		let info = React.createElement('p',
			{className: 'info'},
			credits, classInstanceOffered)

		let details = React.createElement('div',
			{className: 'details'},
			offerings, gereqs, description, info)

		///////

		let semesterList = React.createElement('select',
			{className: 'semester-select'},
			_.map(findSemesterList(), (s =>
				React.createElement('option', {value: s.id, key: s.id}, s.title))))
		tools.push(semesterList)

		let deleteButton = this.props.schedule ?
			React.createElement('button',
				{className: 'remove-course', onClick: this.removeFromSemester},
				'Remove Course') :
			null;
		tools.push(deleteButton);

		let toolsEls = React.createElement('div',
			{className: 'tools', onClick: function(ev) {ev.stopPropagation()}},
			tools)

		///////

		return React.createElement('div', {className: 'info-rows'}, summary, title, details, toolsEls)
	}
})


var CollapsedCourse = React.createClass({
	displayName: 'CollapsedCourse',

	render() {
		let course = this.props.info;

		let title = React.createElement(CourseTitle, _.extend({}, this.props));

		let identifier = React.createElement('span',
			{className: 'identifier'},
			course.dept, ' ', course.num, course.sect);

		let professors = React.createElement('span',
			{className: 'professors'},
			humanize.oxford(course.profs));

		let summary = React.createElement('p',
			{className: 'summary'},
			identifier, professors);

		return React.createElement('div', {className: 'info-rows'}, title, summary)
	}
})

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
			isOpen: false
		}
	},

	toggle() {
		console.log(this.state.isOpen ? 'collapse' : 'expand')
		this.setState({
			isOpen: !this.state.isOpen
		})
	},

	removeFromSemester() {
		this.props.schedule.removeCourse(this.props.info.clbid)
	},

	findWarnings() {
		let thisYear = new Date().getFullYear();
		let warnings = [];

		if (this.props.schedule && (this.props.info.year !== this.props.schedule.year) && this.props.schedule.year <= thisYear) {
			warnings.push({msg: 'This course (from ' + this.props.info.year + ') is not offered in this year (' + this.props.schedule.year + ').'})
		}

		if (this.props.schedule && this.props.info.sem !== this.props.schedule.semester) {
			warnings.push({msg: 'This course (from ' + semesterName(this.props.info.sem) + ') is not offered in this semester.', icon: 'ios7-calendar-outline'})
		}

		if (this.props.conflicts && !_.isUndefined(this.props.index)) {
			let i = this.props.index;
			if (_.any(this.props.conflicts[i])) {
				let conflictIndex = _.findIndex(this.props.conflicts[i], item => item === true)
				conflictIndex = conflictIndex + 1; // because humans don't 0-index lists
				warnings.push({msg: 'This course has a time conflict with the ' + humanize.ordinal(conflictIndex) + ' course.', icon: 'ios7-clock-outline'})
			}
		}

		let warningEls = React.createElement('span',
			{title: _.map(warnings, w => '- ' + w.msg + '\n')},
			_.map(warnings, (w) => {
				let icon = w.icon ? w.icon : 'alert-circled';
				return React.createElement('i', {className: 'ion-' + icon, key: icon})
			}))

		return React.createElement('div',
			{className: 'warnings'},
			warnings.length ? warningEls : null)
	},

	render() {
		let course = this.props.info;

		let courseInfo = this.state.isOpen ?
			React.createElement(ExpandedCourse, _.extend({}, this.props)) :
			React.createElement(CollapsedCourse, _.extend({}, this.props));

		let warnings = this.findWarnings();

		return React.createElement('article',
			_.extend(
				{
					className: 'course ' + (this.state.isOpen ? 'expanded' : 'collapsed'),
					onClick: this.toggle
				},
				this.dragSourceFor(itemTypes.COURSE)),

			courseInfo, warnings
		);
	}
})

var EmptyCourseSlot = React.createClass({
	displayName: 'EmptyCourseSlot',
	render() {
		let title = 'Empty Slot'

		let titleEl = React.createElement('h1', {className: 'title'}, title)
		let details = React.createElement('span', {className: 'details'}, 'no details')

		return React.createElement('article', {className: 'course empty'},
			React.createElement('div', {className: 'info-rows'}, titleEl, details));
	}
})

export default Course
export {EmptyCourseSlot}
