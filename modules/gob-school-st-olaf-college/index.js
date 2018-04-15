export {expandYear, semesterName, toPrettyTerm} from './course-info'

export {
	buildDeptString,
	buildDeptNum,
	deptNumRegex,
	quacksLikeDeptNum,
	splitDeptNum,
} from './deptnums'

export {
	convertStudent,
	getStudentInfo,
	checkIfLoggedIn,
	ExtensionNotLoadedError,
	ExtensionTooOldError,
} from './sis-parser'
