# CHANGELOG

## 2.2.6
- Put some more lodash back in

## 2.2.5
- Removed most usages of lodash
- Added code coverage

## 2.2.4
- Fix lodash pathnames

## 2.2.3
- The dependency update release (lodash@4, babel@6.4, etc.)

## 2.2.2
- Actually fix index.js importing/exporting issues

## 2.2.1
- Fix exports from the manual index.js

## 2.2.0
- Fixed embedding the location into the offering object

## 2.1.3
- Updated to Babel 6
- Did some internal shuffling

## 2.1.2
- removed the `location` field

## 2.1.1
- **Bugfix:** Revert part of 2.0.1
	- we're just going to go back to the old implementation

## 2.1.0
- **Feature:** Locations are now embedded within offerings

## 2.0.2
- **Renamed:** `findTimes` to `findTime`
- **Bugfix:** In 2.0.1, offerings would to share time objects. No longer!
	- This wasn't an issue before because something about our older use of `_.merge` created copies of the objects for us
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
