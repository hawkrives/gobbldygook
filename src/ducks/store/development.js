/* globals module */
import { applyMiddleware, createStore, compose } from 'redux'
import { persistState } from 'redux-devtools'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'
import rootReducer from '../reducers/root'
import DevTools from '../../containers/devtools'
import saveStudent from '../../models/save-student'
import {LOAD_STUDENTS} from '../constants/students'
import startsWith from 'lodash/string/startsWith'

const loggerMiddleware = createLogger()

const shouldTakeAction = ({type}) => {
	return startsWith(type, 'gobbldygook/students/') && type !== LOAD_STUDENTS
}

const saveStudentsMiddleware = store => next => action => {
	if (!shouldTakeAction(action)) {
		return next(action)
	}

	// save a copy of the old state
	const oldState = store.getState()
	const oldStudents = oldState.students.present

	// dispatch the action along the chain
	const result = next(action)

	// grab a copy of the *new* state
	const newState = store.getState()
	const newStudents = newState.students.present

	const studentsToSave = filter(newStudents, (student, id) => newStudents[id] !== oldStudents[id])
	const studentSavingPromises = map(studentsToSave, student => {
		return new Promise((resolve, reject) => {
			saveStudent(student).then(resolve).catch(reject)
		})
	})

	return Promise.all(studentSavingPromises).then(result)
}


const finalCreateStore = compose(
	applyMiddleware(
		promiseMiddleware,
		thunkMiddleware,
		saveStudentsMiddleware,
		loggerMiddleware),
	DevTools.instrument(),
	persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore)

export default function configureStore(initialState) {
	const store = finalCreateStore(rootReducer, initialState)

	if (module.hot) {
		module.hot.accept('../reducers/root', () =>
			store.replaceReducer(require('../reducers/root'))
		)
	}

	return store
}
