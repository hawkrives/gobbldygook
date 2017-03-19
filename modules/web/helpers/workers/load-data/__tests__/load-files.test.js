/* eslint-env jest */

/*
describe: filterForRecentCourses
    test: only returns json filerefs
    test: only returns filerefs sicne $year

describe: finishUp
    test: calls refreshCourses if working on a course index
    test: calls refreshAreas if working on an area index
    test: removes the notification

describe: deduplicateAreas
    test: only calls removeDuplicateAreas if working on an area index

describe: slurpIntoDatabase
    test: exits early if no files are given
    test: starts the notification
    test: calls updateDatabase once for each file given

describe: filterFiles
    test: calls needsUpdate once per file
    test: returns only files that needsUpdate says need updates

describe: getFilesToLoad
    test: returns the input array if loading areas
    test: filters the input array if loading courses

describe: proceedWithUpdate
    test: calls the sequence of functions
    test: rejects if one fails

describe: loadFiles
    test: calls fetch with the input url
    test: calls proceedWithUpdate if the fetch succeeds
    test: calls handleErrors if the fetch fails
*/
