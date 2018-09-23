# gobbldygook-cli

`gob` is the command-line interface for Gobbldygook. It can examine a student file for graduatability purposes, convert the SIS output into a Gobbldygook file, validate a set of schedules in a student file, or lint an area-of-study file for common issues.

```
$ gob-examine --help
Usage: gob-examine <student-data.json> | gob-examine < student-data.json

Commands:
	gob-examine: examine a student file for graduatability
	gob-validate: validate the schedules in a student file for time conflicts
	gob-convert: convert a SIS export into a Gobbldygook student file
	gob-lint-area: lint an area-of-study file for common issues

Options:
	-h, --help: print this help text
```
