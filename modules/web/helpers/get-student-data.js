import props from 'p-props'
import { embedActiveStudentCourses } from './embed-active-student-courses'
import { getStudentStudies } from './get-student-studies'
import { fulfillFulfillments } from './fulfill-fulfillments'

export function getStudentData(student, { areas, courses }) {
  const promisedAreas = getStudentStudies(student, { cache: areas })
  const promisedSchedules = embedActiveStudentCourses(student, { cache: courses })
  const promisedFulfillments = fulfillFulfillments(student, { cache: courses })

  return props({
    areas: promisedAreas,
    schedules: promisedSchedules,
    fulfilled: promisedFulfillments,
  })
	.then(data => ({
  ...student,
  ...data,
}))
	.catch(err => {
  throw err
})
}
