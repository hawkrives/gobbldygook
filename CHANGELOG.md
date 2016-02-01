# CHANGELOG

## [Unreleased]

## [3.0.0-beta6] - unreleased
- Fixed mouse cursor being a pointer over the entire area of study body; made it only change over the title bit.
- Always sort areas of study by type
- Add a "make student" button when there are no students, instead of showing an empty list
- Enable the "upload student" screen, and allow it to import multiple students at once


## [3.0.0-beta2] - 2015-10-12
### Changed
- Stuff (this should be the last changelog with this entry…)
- Began automating changelog/releases/stuff
- Display "subtitles" for some courses
	- Show subtitles on seminars and topics courses


## [3.0.0-beta.1] - 2015-10-09
- NEW: added syntax to the Hanson format
	- `<n> courses from children where {}`
		facilitates the Film Studies "… one of which must be a 300-level course" requirement: `one course from children where {level = 300}`
	- sugar for multiple possible values in a where-query: `… where {dept=(ENGL|FREN)}`
		You could already do `… where {dept=ENGL | dept=FREN}`; this is just some sugary syntax. (Thanks, WMGST!)
- NEW: Sort and Group courses in the search sidebar


## [3.0.0-beta.0]
- removed extraneous dependencies on lodash to reduce the build size


## [3.0.0-alpha.16]
- updated node-sass to 3.2.0
- made buttons more consistent
- changed year headings to be horizontal, instead of vertical


## [3.0.0-alpha.15]
- made things prettier
- implemented graphical area of study management
- fixed bugs related to the StudentSummmary block's input fields
- save/load area of study data from the database
- handle area loading errors (shows error message buts continues to compute others)
- allow sorting the list of students


## [3.0.0-alpha.14]
- Rebuilt area of study processing on top of the new Hanson format
- Included the hanson processors in the main repo
- Switch to Webpack for the build system


## [3.0.0-alpha.12]
- Stuff and more stuff
- I really ought to update this more often
- Switched back to Sass


## [3.0.0-alpha.11]
- Switched to Stylus as a pre-processor
- Updated 6to5
- Updated sto-helpers and sto-sis-time-parser


## [3.0.0-alpha.10]
- Added `courses` as the first parameter to `queryCourses`, allowing the full power of that weird query engine to run over any list of courses.


## [3.0.0-alpha.9]
- Modularized app
	- pulled areas (now at https://github.com/hawkrives/gobbldygook-area-data), courses (https://github.com/hawkrives/gobbldygook-course-data), helpers (https://github.com/hawkrives/sto-helpers), and the time parser (https://github.com/hawkrives/sto-sis-time-parser) into separate npm modules
- Updated `student.studies` array
	- we now only use the `id` and `year` fields
	- `year` is to identify which version of the area to load and check
- Updated 6to5
- Continued to add automated tests
	- well, this version actually has fewer, since so many flew away into helpers or areas.
- Fixed "Revert to Demo" button
- Added "Undo" and "Redo" buttons
