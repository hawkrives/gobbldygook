# CHANGELOG

## 3.0.0alpha9

- Modularized app
	- pulled [areas][sto-areas], [courses][sto-courses], [helpers][sto-helpers], and the [time parser][sto-sis-time-parser] into seperate npm modules
- Updated `student.studies` array
	- we now only use the `id` and `year` fields
	- `year` is to identify which version of the area to load and check
- Updated 6to5
- Continued to add automated tests
	- well, this version actually has fewer, since so many flew away into helpers or areas.
- Fixed "Revert to Demo" button
- Added "Undo" and "Redo" buttons
	- they do, however, expose that moving a course by dragging is currently a two-step process.

[sto-areas]: https://github.com/hawkrives/gobbldygook-area-data
[sto-courses]: https://github.com/hawkrives/gobbldygook-course-data
[sto-helpers]: https://github.com/hawkrives/sto-helpers
[sto-sis-time-parser]: https://github.com/hawkrives/sto-sis-time-parser
