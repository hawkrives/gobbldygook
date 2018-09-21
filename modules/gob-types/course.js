// @flow

export type Offering = {
	day: string,
	location: string,
	start: string,
	end: string,
}

export type Course = {
	clbid: string,
	credits: number,
	crsid: string,
	department: string,
	enrolled: number,
	gereqs: Array<string>,
	groupid: string,
	instructors: Array<string>,
	level: number,
	max: number,
	name: string,
	number: number,
	pf: boolean,
	prerequisites: false | string,
	section: string,
	status: string,
	semester: number,
	type: string,
	year: number,
	offerings: Array<Offering>,
	revisions: {
		...Course,
		_updated: string,
	},
}
