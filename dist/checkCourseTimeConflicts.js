"use strict";

var forEach = require("lodash").forEach;


function checkCourseTimeConflicts(mainCourse, altCourse) {
  var conflict = false;

  forEach(mainCourse.offerings, function (mainOffer) {
    forEach(altCourse.offerings, function (altOffer) {
      // Cannot conflict if on different days.
      if (mainOffer.day === altOffer.day) {
        forEach(mainOffer.times, function (mainTime) {
          forEach(altOffer.times, function (altTime) {
            // let altStartsAfterMain      = altTime.start >= mainTime.start
            var altStartsBeforeMainEnds = altTime.start <= mainTime.end;
            var altEndsAfterMainStarts = altTime.end >= mainTime.start;
            // let altEndsBeforeMainEnds   = altTime.end <= mainTime.end

            if (altStartsBeforeMainEnds && altEndsAfterMainStarts) {
              conflict = true;
            }
          });
        });
      }
    });
  });

  return conflict;
}

module.exports = checkCourseTimeConflicts;