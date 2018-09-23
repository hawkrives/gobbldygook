// @flow

export type Offering = {|
	+day: string,
	+location?: string,
	+start: string,
	+end: string,
|}

export type Course = {
	+type: 'course',
	+clbid: string,
	+credits: number,
	+crsid: string,
	+description: string,
	+department: string,
	+enrolled: number,
	+gereqs: Array<string>,
	+groupid: string,
	+instructors: Array<string>,
	+level: number,
	+max: number,
	+name: string,
	+number: number,
	+pf: boolean,
	+prerequisites: false | string,
	+section: string,
	+status: string,
	+semester: number,
	+title?: string,
	+type: string,
	+year: number,
	+offerings?: Array<Offering>,
	+revisions: Array<{|
		...$Exact<Course>,
		+_updated: string,
	|}>,
}

export type CourseError = {|
	+type: 'error',
	+error: string | Error,
	+clbid: string,
|}
