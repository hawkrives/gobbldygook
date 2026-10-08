# gobbldygook-cli

`gob` is the command-line interface for Gobbldygook. It can examine a student file for graduatability purposes, convert the SIS output into a Gobbldygook file, validate a set of schedules in a student file, or benchmark how long examining a student takes.

```
$ gob-examine --help
Usage: gob-examine <student-data.json> | gob-examine < student-data.json

Commands:
	gob-examine: examine a student file for graduatability
	gob-validate: validate the schedules in a student file for time conflicts
	gob-convert: convert a SIS export into a Gobbldygook student file
	gob-benchmark: time how long each of a student's areas takes to examine

Options:
	-h, --help: print this help text
```
