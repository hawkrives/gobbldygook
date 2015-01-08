"use strict";

var _slicedToArray = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  }
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var contains = require("lodash").contains;
var map = require("lodash").map;
var daysOfTheWeek = _interopRequire(require("./daysOfTheWeek"));

function findDays(daystring) {
  var listOfDays = [];

  if (contains(daystring, "-")) {
    // M-F, M-Th, T-F
    var sequence = ["M", "T", "W", "Th", "F"];
    var _daystring$split = daystring.split("-");

    var _daystring$split2 = _slicedToArray(_daystring$split, 2);

    var startDay = _daystring$split2[0];
    var endDay = _daystring$split2[1];
    listOfDays = sequence.slice(sequence.indexOf(startDay), sequence.indexOf(endDay) + 1);
  } else {
    // MTThFW or M/T/Th/F/W
    var spacedOutDays = daystring.replace(/([A-Z][a-z]?)\/?/g, "$1 ");
    // The regex sticks an extra space at the end. Remove it.
    spacedOutDays = spacedOutDays.substr(0, spacedOutDays.length - 1);
    listOfDays = spacedOutDays.split(" ");
  }

  // 'M' => 'Mo'
  return map(listOfDays, function (day) {
    return daysOfTheWeek[day];
  });
}

module.exports = findDays;