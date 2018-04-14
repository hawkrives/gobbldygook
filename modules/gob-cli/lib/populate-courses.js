'use strict'
const flatten = require('lodash/flatten')
const includes = require('lodash/includes')

const searchForCourses = require('./search-for-courses')

function getCoursesByClbid(clbids) {
    return searchForCourses({
        riddles: [course => includes(clbids, course.clbid)],
    })
}

async function populateCourses(student) {
    const clbids =
        student.clbids ||
        flatten(student.schedules.filter(s => s.active).map(s => s.clbids))
    let courses = await getCoursesByClbid(clbids)
    courses = courses.map(c => {
        c.department = c.departments
        return c
    })
    return courses
}

module.exports = populateCourses
module.exports.getCoursesByClbid = getCoursesByClbid
