import Reflux from 'reflux'

let studentActions = Reflux.createActions([
	'_loadData',
	'undo',
	'redo',
	'changeName',
	'changeActive',
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
	'addOverride',
	'removeOverride',
	'addFabrication',
	'removeFabrication',
])

export default studentActions
window.actions = studentActions
