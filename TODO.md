Listen to localStorage's 'storage' event to trigger re-renders when content in the database changes

---

adding a schedule with a year and semester of 0 causes an infinite loop

yep, it's still there. why does this bug exist. hmm.

`actions.addSchedule(stu.id, {year: 0, semester: 0, active: true, title: 'New Schedule', index: 1})`

---

# [9:46 PM] Drew Volz:

I have two ideas for the credit tracking.

1. Progress bar at the very top of the `student-summary can-graduate` div. It
would be a colored progress bar much like your other progress bars around the
application.

2. The circle around the initial of the user’s first name. The progress bar
could _wrap_ around the initial much like the current border/outline does, but
instead of it being complete, it is only as far around as your progress
towards completion of credits.


## [9:54 PM] Drew Volz:

Three interesting things

1. [ ] I just ran into a horrifying bug… I cannot seem to replicate it either.
I was adding a course (Hinduism) for Fall 2015 to my schedule and it didn’t
quite _add_ to my schedule. It would drag, drop, but not add. I did it several
times. I forgot to look at the log, but when I refreshed the page, my user was
deleted. Luckily I backed up my data, but I’ll be desperately trying to break
it again.


-----

- WhereExpressions need to accomodate for multiple qualifiers.

- The courses are rendering the fully-qualified indicators on the second computation/render/pass/whatever
- They should never render the fully-qualified indicator
