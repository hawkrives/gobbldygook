import Reflux from 'reflux'

let studentActions = Reflux.createActions([
	'reload',
	'undo',
	'redo',

	'initStudent',
	'importStudent',
	'destroyStudent',

	'changeName',
	'changeAdvisor',
	'changeCreditsNeeded',
	'changeMatriculation',
	'changeGraduation',
	'changeSetting',

	'addArea',
	'removeArea',
	'removeMultipleAreas',
	'reorderArea',

	'addSchedule',
	'destroySchedule',
	'destroyMultipleSchedules',
	'renameSchedule',
	'reorderSchedule',
	'moveSchedule',

	'addCourse',
	'removeCourse',
	'reorderCourse',
	'moveCourse',

	'setOverride',
	'removeOverride',

	'addFabrication',
	'removeFabrication',

	'resetStudentToDemo',
])

export default studentActions
window.actions = studentActions
