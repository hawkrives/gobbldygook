import * as Reflux from 'reflux'

let studentActions = Reflux.createActions([
	'_loadData',
	'undo',
	'redo',
	'changeName',
	'changeActive',
	'changeCreditsNeeded',
	'changeMatriculation',
	'changeGraduation',
	'addArea',
	'addSchedule',
	'removeArea',
	'removeMultipleAreas',
	'destroySchedule',
	'destroyMultipleSchedules',
	'renameSchedule',
	'reorderSchedule',
	'moveSchedule',
	'addCourse',
	'removeCourse',
	'reorderCourse',
	'reorderArea',
])

export default studentActions
