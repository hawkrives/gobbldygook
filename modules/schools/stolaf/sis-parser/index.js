// can't use export * with babel: see https://github.com/babel/babel/issues/4446
export { convertStudent } from './convert-imported-student'

export {
	getStudentInfo,
	checkIfLoggedIn,
	ExtensionNotLoadedError,
	ExtensionTooOldError,
} from './import-student'
