# CHANGELOG

## 2.1.0
- **Feature:** Locations are now embedded within offerings

## 2.0.2
- Fixed a bug where offerings could share time objects
- Renamed `findTimes` to `findTime`
- Updated publish script to exit as soon as any step errors

## 2.0.1
- Updated Babel
- Removed accidental dependency on the *entirety* of lodash

## 2.0.0
- **Renamed:** `checkCourseTimeConflicts` -> `checkCoursesForTimeConflicts`
- **Renamed:** `checkScheduleTimeConflicts` -> `findScheduleTimeConflicts`
- **Added:** `checkScheduleForTimeConflicts` - returns true if there is a time conflict and false otherwise
- Finished adding tests for the helper functions
- Updated 6to5

## 1.0.9
- Update lodash
- Write a script to automatically update the index.js file

## 1.0.8
- Fix camel-casing in `cleanTimeStringSegment`

## 1.0.7
- Add .npmignore

## 1.0.6
- Add `.npmignore` so we don't publish extra files
