// @flow

export const SORT_BY = {
	year: 'Year',
	title: 'Title',
	department: 'Department',
	day: 'Day of Week',
	time: 'Time of Day',
}

export const GROUP_BY = {
	day: 'Day of Week',
	department: 'Department',
	gened: 'GenEd',
	semester: 'Semester',
	term: 'Term',
	time: 'Time of Day',
	year: 'Year',
	none: 'None',
}

export const sortByOptions: Array<string> = (Object.values(SORT_BY): Array<any>)
export const groupByOptions: Array<string> = (Object.values(GROUP_BY): Array<
	any,
>)
