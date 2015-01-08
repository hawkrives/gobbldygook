"use strict";

/**
 * Clean a timestring segment by uppercasing and trimming it.
 *
 * @param {String} segment
 * @returns {String}
 */
function cleanTimestringSegment(segment) {
  var uppercased = segment.toUpperCase();
  var trimmed = uppercased.trim();
  return trimmed;
}

module.exports = cleanTimestringSegment;