"use strict";

(function (module) {
  var combinations = module.exports = function* (array, count) {
    if (array === undefined) {
      array = [];
    }
    if (count === undefined) {
      count = 0;
    }
    var keys = [];
    var arrayLength = array.length;
    var index = 0;
    for (var i = 0; i < count; i++) {
      keys.push(-1);
    }
    while (index >= 0) {
      if (keys[index] < arrayLength - (count - index)) {
        for (var key = keys[index] - index + 1; index < count; index++) {
          keys[index] = key + index;
        }
        yield keys.map(function (c) {
          return array[c];
        });
      } else {
        index--;
      }
    }
  };
})(module);
