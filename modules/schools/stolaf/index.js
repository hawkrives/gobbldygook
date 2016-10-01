// can't use export * with babel: see https://github.com/babel/babel/issues/4446
export {
	expandYear,
	semesterName,
	toPrettyTerm,
} from './course-info'

export {
	buildCourseIdent,
	buildDept,
	buildDeptNum,
	deptNumRegex,
	quacksLikeDeptNum,
	splitDeptNum,
} from './deptnums'

export {
	convertStudent,
	getStudentInfo,
} from './sis-parser'
