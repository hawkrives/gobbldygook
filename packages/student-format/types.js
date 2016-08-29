// @flow

export type ScheduleMetadata = {};

export type Schedule = {
	id: string,
	active: boolean,

	index: number,
	title: string,

	clbids: number[],
	year: number,
	semester: 0|1|2|3|4|5|9,

	metadata: ScheduleMetadata,
};

export type StudyTypes = 'major'|'concentration'|'emphasis'|'degree';
export type Study = {
	type: StudyTypes,
};
export type Override = {};
export type Fabrication = {};
export type Fulfillment = {};

export type Student = {
	id: string,
	name: string,
	version: string,

	creditsNeeded: number,

	matriculation: number,
	graduation: number,
	advisor: string,

	dateLastModified: Date,
	dateCreated: Date,

	studies: Study[],
	schedules: {[key: string]: Schedule},
	overrides: {[key: string]: Override},
	fabrications: {[key: string]: Fabrication},
	fulfillments: {[key: string]: Fulfillment},

	settings: {[key: string]: any},
};
