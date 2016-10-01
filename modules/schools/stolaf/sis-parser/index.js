// can't use export * with babel: see https://github.com/babel/babel/issues/4446
export {convertStudent} from './convert-imported-student'

export {
	ExtensionNotLoadedError,
	ExtensionTooOldError,
	extractTermList,
	extractStudentIds,
	getCoursesFromHtml,
	getGraduationInformation,
	checkIfLoggedIn,
	getStudentInfo,
} from './import-student'
