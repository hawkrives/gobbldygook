"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var forEach = require("lodash").forEach;
var merge = require("lodash").merge;
var isArray = require("lodash").isArray;
var toArray = require("lodash").toArray;
var findDays = _interopRequire(require("./findDays"));

var findTimes = _interopRequire(require("./findTimes"));

function convertTimeStringsToOfferings(course) {
  var offerings = {};

  forEach(course.times, function (time) {
    var daystring = time.split(" ")[0];
    var timestring = time.split(" ")[1];

    var days = findDays(daystring);
    var times = findTimes(timestring);

    forEach(days, function (day) {
      if (!offerings[day]) {
        offerings[day] = {};
      }

      merge(offerings[day], { day: day, times: [times] }, function (a, b) {
        return isArray(a) ? a.concat(b) : undefined;
      });
    });
  });

  return toArray(offerings);
}

module.exports = convertTimeStringsToOfferings;