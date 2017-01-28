import flatten from 'lodash/flatten'
import includes from 'lodash/includes'

import searchForCourses from './search-for-courses'

export function getCoursesByClbid(clbids) {
  return searchForCourses({ riddles: [ course => includes(clbids, course.clbid) ] })
}

export default async function populateCourses(student) {
  const clbids = student.clbids || flatten(student.schedules.filter(s => s.active).map(s => s.clbids))
  let courses = await getCoursesByClbid(clbids)
  courses = courses.map(c => {
    c.department = c.departments
    return c
  })
  return courses
}
