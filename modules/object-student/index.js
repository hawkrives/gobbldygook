'use strict'

const { areaTypeConstants } = require('./area-types')

const { encodeStudent, prepareStudentForSave } = require('./encode-student')

const { filterAreaList } = require('./filter-area-list')

const {
	findWarnings,
	checkForInvalidYear,
	checkForInvalidSemester,
	checkForTimeConflicts,
} = require('./find-course-warnings')

const { isCurrentSemester } = require('./is-current-semester')

const {
	IDENT_COURSE,
	IDENT_AREA,
	IDENT_YEAR,
	IDENT_SEMESTER,
	IDENT_SCHEDULE,
} = require('./item-types')

const { Schedule } = require('./schedule')

const { sortStudiesByType } = require('./sort-studies-by-type')

const {
	Student,
	changeStudentName,
	changeStudentAdvisor,
	changeStudentCreditsNeeded,
	changeStudentMatriculation,
	changeStudentGraduation,
	changeStudentSetting,
	addScheduleToStudent,
	destroyScheduleFromStudent,
	addCourseToSchedule,
	removeCourseFromSchedule,
	moveCourseToSchedule,
	addAreaToStudent,
	removeAreaFromStudent,
	setOverrideOnStudent,
	removeOverrideFromStudent,
	addFabricationToStudent,
	removeFabricationFromStudent,
	moveScheduleInStudent,
	reorderScheduleInStudent,
	renameScheduleInStudent,
	reorderCourseInSchedule,
} = require('./student')

const { validateSchedule } = require('./validate-schedule')

const { validateSchedules } = require('./validate-schedules')

module.exports = {
    areaTypeConstants,
    encodeStudent,
    prepareStudentForSave,
    filterAreaList,
    findWarnings,
    checkForInvalidYear,
    checkForInvalidSemester,
    checkForTimeConflicts,
    isCurrentSemester,
    Schedule,
    sortStudiesByType,
    IDENT_COURSE,
    IDENT_AREA,
    IDENT_YEAR,
    IDENT_SEMESTER,
    IDENT_SCHEDULE,
    validateSchedule,
    validateSchedules,
    Student,
    changeStudentName,
    changeStudentAdvisor,
    changeStudentCreditsNeeded,
    changeStudentMatriculation,
    changeStudentGraduation,
    changeStudentSetting,
    addScheduleToStudent,
    destroyScheduleFromStudent,
    addCourseToSchedule,
    removeCourseFromSchedule,
    moveCourseToSchedule,
    addAreaToStudent,
    removeAreaFromStudent,
    setOverrideOnStudent,
    removeOverrideFromStudent,
    addFabricationToStudent,
    removeFabricationFromStudent,
    moveScheduleInStudent,
    reorderScheduleInStudent,
    renameScheduleInStudent,
    reorderCourseInSchedule,
}
