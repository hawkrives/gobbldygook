'use strict';

import * as _ from 'lodash'
import * as Reflux from 'reflux'

import uuid from '../helpers/uuid'
import * as Immutable from 'immutable'

import randomChar from '../helpers/randomChar'

import {Student,Schedule,Study} from '../actions/Actions.reflux'

import * as demoStudent from '../../mockups/demo_student.json'

var StudentStore = Reflux.createStore({
	init() {
		console.log('StudentStore.initialize')
		this.students = {}
		this.active = {}

		this.onCreate(demoStudent)

		this.listenToMany(Student)
		// this.listenToMany(Schedule)
		// this.listenToMany(Study)

		// this.listenTo(Student.create,       this.onCreate)
		// this.listenTo(Student.decode,       this.onDecode)
		// this.listenTo(Student.destroy,      this.onDestroy)
		// this.listenTo(Student.edit,         this.onEdit)
		// this.listenTo(Student.encode,       this.onEncode)
		// this.listenTo(Student.save,         this.onSave)
		// this.listenTo(Student.toggleActive, this.onToggleActive)
		// this.listenTo(Student.undo,         this.onUndo)
		// this.listenTo(Student.update,       this.onUpdate)

		this.listenTo(Schedule.addCourse,       this.handleScheduleCourseAdd)
		this.listenTo(Schedule.create,          this.handleScheduleCreate)
		this.listenTo(Schedule.destroy,         this.handleScheduleDestroy)
		this.listenTo(Schedule.destroyMultiple, this.handleScheduleDestroyMultiple)
		this.listenTo(Schedule.edit,            this.handleScheduleEdit)
		this.listenTo(Schedule.move,            this.handleScheduleMove)
		this.listenTo(Schedule.removeCourse,    this.handleScheduleCourseRemove)
		this.listenTo(Schedule.rename,          this.handleScheduleRename)
		this.listenTo(Schedule.reorder,         this.handleScheduleReorder)
		this.listenTo(Schedule.reorderCourse,   this.handleScheduleCourseReorder)
		this.listenTo(Schedule.showDetail,      this.handleScheduleShowDetail)
		this.listenTo(Schedule.toggleActivate,  this.handleScheduleToggleActivate)
		this.listenTo(Schedule.undo,            this.handleScheduleUndo)

		this.listenTo(Study.add,        this.handleStudyAdd)
		this.listenTo(Study.remove,     this.handleStudyRemove)
		this.listenTo(Study.reorder,    this.handleStudyReorder)
		this.listenTo(Study.toggleOpen, this.handleStudyToggleOpen)
		this.listenTo(Study.undo,       this.handleStudyUndo)
	},

	// Student Actions
	onEncode: function() {},

	onDecode: function() {},

	onUpdate: function(student) {},

	onCreate: function(student) {
		console.log('StudentStore.createStudent')
		var genericStudent = {
			id: uuid(),
			name: 'Student ' + randomChar(),
			active: false,
			matriculation: 1874,
			graduation: 2016,
			creditsNeeded: 35,
			studies: {},
			schedules: {},
			overrides: {},
			fabrications: {},
		}

		var joinedStudent = _.merge(genericStudent, student)

		if (_.size(this.students) > 0)
			joinedStudent.active = false

		this.students[joinedStudent.id] = joinedStudent

		this.findActiveStudent()
	},

	onDestroy: function(student) {
		console.log('StudentStore.destroyStudent')
		delete this.students[student.id]

		if (_.size(this.students) > 0) {
			this.findActiveStudent()
		} else {
			this.onCreate()
		}
	},

	onUndo: function() {
		this.findActiveStudent()
	},

	onToggleActive: function(student) {
		console.log('StudentStore.toggleStudentActive')

		this.students[student.id].active = !(this.students[student.id].active)

		this.findActiveStudent()
	},

	onSave: function() {},

	// Schedule Actions
	handleScheduleCreation: function(args) {
		console.log('StudentStore.createSchedule')

		// args: {studentId, schedule}
		var studentId = args.studentId
		var schedule = args.schedule

		var genericSchedule = {
			id: uuid(),
			year: 0,
			semester: 0,
			title: 'Schedule ' + randomChar().toUpperCase(),
			index: 1,
			clbids: [],
		}

		schedule.active = _.size(this.students[studentId].schedules) > 0 ? false : true

		var joinedSchedule = _.merge(genericSchedule, schedule)

		this.students[studentId].schedules[joinedSchedule.id] = joinedSchedule

		console.log(this.students[studentId].schedules[joinedSchedule.id])

		this.trigger(this.active)
	},

	handleScheduleDestruction: function(args, emitChange) {
		console.log('StudentStore.destroySchedule')
		emitChange = emitChange || false

		// args: {studentId, scheduleId}
		var studentId = args.studentId
		var scheduleId = args.scheduleId.toString()

		delete this.students[studentId].schedules[scheduleId]

		if (emitChange)  this.trigger(this.active)
	},

	handleMultipleScheduleDestruction: function(args) {
		console.log('StudentStore.destroyMultipleSchedules')

		// args: {studentId, schedule}
		var studentId = args.studentId
		var scheduleIds = args.scheduleIds

		_.each(scheduleIds, function(scheduleId) {
			this.handleScheduleDestruction({studentId: studentId, scheduleId: scheduleId}, false)
		}, this)

		this.trigger(this.active)
	},

	handleScheduleRename: function() {},

	handleScheduleMove: function() {},

	handleScheduleReorder: function() {},

	handleScheduleToggleActivate: function() {},

	handleScheduleCourseAdd: function() {},

	handleScheduleCourseRemove: function() {},

	handleScheduleCourseMove: function() {},

	handleScheduleUndo: function() {},

	handleScheduleChanged: function() {},

	handleScheduleShowDetail: function() {},

	// Area of Study Actions
	handleStudyAdd: function() {},

	handleStudyRemove: function() {},

	handleStudyReorder: function() {},

	handleStudyUndo: function() {},

	handleStudyToggleOpen: function() {},

	findActiveStudent: function() {
		console.log('StudentStore.findActiveStudent')

		// try to find active student
		var activeStudentId = _.findKey(this.students, {active: true});

		// if there is an active student, put it in active
		if (activeStudentId) {
			this.active = this.students[activeStudentId]
		}

		// otherwise, make the next one active
		else if (_.size(this.students) > 0) {
			this.onToggleActive(_.first(_.toArray(this.students)))
		}

		// otherwise, make a student
		else {
			this.onCreate()
		}

		this.trigger(this.active)
	},
})

export default StudentStore
