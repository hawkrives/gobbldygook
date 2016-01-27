## Where expressions

- WhereExpressions need to accomodate for multiple qualifiers.

- The courses are rendering the fully-qualified indicators on the second computation/render/pass/whatever
- They should never render the fully-qualified indicator


## Semester 0

> semester '0' is year-long

it's actually a temporary term for abroad programs. it's broken up into the actual
semesters once the program is over.


## Non-major Majors

"Students must declare a major by fall semester of the junior year.""

(also should add a blank file for "Individual Major")


## Exceptional Courses

They show up in the middle of semesters.

	2015	1	GE	1	REG	0150	FOL Proficiency-Arabic	NG	(0.00)	ADJ	FOL-Y


## "At Most" queries

> 6 electives. At most 2 may be level 2.

> No level 1 are required. Up to 3 L1 may count, but no more than 2 seminars.

> 10 math courses, that is, 7 excluding Basics, of which at most 2 may be outside of MATH.

> At most 2 level 1 BIO courses.

Collect courses up to the limit, then return. Remove any other matches from the list.


## New Search Syntax

old: `dept: $NOR  dept: AMCON  dept: GCON  gereq: HWC  year: 2015`
new: `dept: !AMCON and !GCON  gereq: HWC  year: 2015`

```yaml
op:: $and
value:
  - op: $and
    value:
      - {op: $ne, key: 'dept', value: 'AMCON'}
      - {op: $ne, key: 'dept', value: 'GCON'}
  - op: $eq
    key: gereq
    value: HWC
  - op: $eq
    key: year
    value: 2015
```


query: `dept: !AMCON and !GCON`
```yaml
op: $and
value:
  - {op: $ne, key: 'dept', value: 'AMCON'}
  - {op: $ne, key: 'dept', value: 'GCON'}
```


query: `dept: !AMCON or !GCON`
```yaml
op: $or
value:
  - {op: $ne, key: 'dept', value: 'AMCON'}
  - {op: $ne, key: 'dept', value: 'GCON'}
```


query: `dept: !(AMCON or GCON)`
```yaml
op: $not
value:
  - op: $or
    value:
      - {op: $ne, key: 'dept', value: 'AMCON'}
      - {op: $ne, key: 'dept', value: 'GCON'}
```
