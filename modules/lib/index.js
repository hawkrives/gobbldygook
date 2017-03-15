'use strict'
const { compareProps } = require('./compare-props')
const { AuthError, NetworkError } = require('./errors')
const { status, classifyFetchErrors, json, text } = require('./fetch-helpers')
const {
    findMissingNumberBinarySearch,
} = require('./find-missing-number-binary-search')
const { findWordForProgress } = require('./find-word-for-progress')
const { interpose } = require('./interpose')
const { partitionByIndex } = require('./partition-by-index')
const { randomChar } = require('./random-char')
const { splitParagraph } = require('./split-paragraph')
const { stringifyError } = require('./stringify-error')
const { to12HourTime } = require('./to-12-hour-time')
const { zipToObjectWithArrays } = require('./zip-to-object-with-arrays')

module.exports = {
    compareProps,
    AuthError,
    NetworkError,
    status,
    classifyFetchErrors,
    json,
    text,
    findMissingNumberBinarySearch,
    findWordForProgress,
    interpose,
    partitionByIndex,
    randomChar,
    splitParagraph,
    stringifyError,
    to12HourTime,
    zipToObjectWithArrays,
}
