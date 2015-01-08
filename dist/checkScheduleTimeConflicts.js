"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var map = require("lodash").map;
var checkCourseTimeConflicts = _interopRequire(require("./checkCourseTimeConflicts"));

function checkScheduleTimeConflicts(courses) {
  // results = {
  // 		c1: {
  // 			c1: null,
  // 			c2: false,
  // 			c3: true
  // 		},
  // 		c2: {
  // 			c1: false,
  // 			c2: null,
  // 			c3: false
  // 		},
  // 		c3: {
  // 			c1: true,
  // 			c2: false,
  // 			c3: null,
  // 		}
  // }
  // true = conflict, false = no conflict, null = same course

  if (courses.toArray) courses = courses.toArray();

  var results = map(courses, function (c1, c1idx) {
    return map(courses, function (c2, c2idx) {
      var result = false;
      if (c1 === c2) result = null;else if (checkCourseTimeConflicts(c1, c2)) result = true;
      return result;
    });
  });

  return results;
}

module.exports = checkScheduleTimeConflicts;