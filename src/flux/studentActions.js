import Reflux from 'reflux'

let studentActions = Reflux.createActions([
	'reload',
	'undo',
	'redo',

	'initStudent',
	'importStudent',
	'destroyStudent',

	'changeName',
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

	'addOverride',
	'removeOverride',

	'addFabrication',
	'removeFabrication',

	'resetStudentToDemo',
])

export default studentActions
window.actions = studentActions
