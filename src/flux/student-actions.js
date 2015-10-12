import Reflux from 'reflux'

const studentActions = Reflux.createActions([
	'reload',
	'refreshData',
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
	'editArea',

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
if (typeof window !== 'undefined') {
	window.actions = studentActions
}
