import getStudentCourses from './get-student-courses'

export default async function getStudentData(student) {
	const courses = await getStudentCourses(student)

	return {
		courses: courses,
		creditsNeeded: student.creditsNeeded,
		fabrications: student.fabrications,
		graduation: student.graduation,
		matriculation: student.matriculation,
		overrides: student.overrides,
	}
}
