# stolaf-sis-timestring-parser

[![Build Status](https://travis-ci.org/StoDevX/sto-sis-time-parser.svg?branch=master)](https://travis-ci.org/hawkrives/sto-sis-time-parser)

A parser to take the wierd timestrings from St. Olaf's SIS and turn them into a semi-usable format.

Example:

```js
// input
['MT 0100-0400PM', 'MF 0905-1000']

// output
[
	{ day: 'Mo', times: [{ start: 1300, end: 1600 }, { start: 905, end: 1000 }] },
	{ day: 'Tu', times: [{ start: 1300, end: 1600 }] },
	{ day: 'Fr', times: [{ start: 905,  end: 1000 }] },
]
```
