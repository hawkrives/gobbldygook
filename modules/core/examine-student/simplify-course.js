// @flow
import sortBy from 'lodash/sortBy'
// import memoize from 'lodash/memoize'
// import identity from 'lodash/identity'
import type { Course } from './types'

/**
 * Simplifies a course to just the department/number combo.
 *
 * Because we can't expect the handy unique crsid to exist on courses from
 * area specs, we have to figure it out on our own.
 * The closest thing we can do is to reduce a course to the department +
 * number combination.
 * We're overloading the term "course" even more than normal here, so
 * in this case, it's a set of key:value props that are applied as a
 * filter to a list of fully-fledged course objects (which are actually
 * "class" objects, but whatevs.)
 * So, if c1 looks like {department: A, number: 1}, and c2 looks like
 * {department: A, number: 1, year: 2015}, c2 is a more specific instance of c1.
 *
 * We also take into account that some courses are FLAC courses. The bugbear
 * with FLAC courses is that they share a deptnum+term with another, non-FLAC
 * course – every single one does this.
 *
 * (And, I think, so do some labs.)
 *
 * To get around this, we'll append the course type to the simplified course.
 *
 * @private
 * @param {Course} course - the course to simplify
 * @returns {string} - the stringified, simplified course
 */
function simplifyCourse(course: Course): string {
	return `${sortBy(course.department).join('/')} ${course.number} ${course.type}`
}

export default simplifyCourse
// export default memoize(simplifyCourse, identity)
