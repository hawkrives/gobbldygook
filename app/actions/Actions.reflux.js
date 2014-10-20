'use strict';

import * as Reflux from 'reflux'

var Student = Reflux.createActions([
	'create',
	'decode',
	'destroy',
	'edit',
	'encode',
	'save',
	'toggleActive',
	'undo',
	'update',
])

var Schedule = Reflux.createActions([
	'addCourse',
	'create',
	'destroy',
	'destroyMultiple',
	'edit',
	'move',
	'removeCourse',
	'rename',
	'reorder',
	'reorderCourse',
	'showDetail',
	'toggleActivate',
	'undo',
]);

var Study = Reflux.createActions([
	'add',
	'remove',
	'reorder',
	'toggleOpen',
	'undo',
]);

export {
	Student,
	Schedule,
	Study
}
