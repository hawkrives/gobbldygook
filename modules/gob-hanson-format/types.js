// @flow

export type Mapped<T> = {[key: string]: T}

export type HansonFile = {
	name: string,
	type: string,
	revision: string,
	result: string,
	dateAdded?: string,
	sourcePath?: string,
	slug?: string,
	'available through'?: string,
	[key: string]: Mapped<string | HansonRequirement>,
}

export type ParsedHansonFile = {
	name: string,
	type: string,
	revision: string,
	result: Object,
	slug: string,
	dateAdded?: string,
	sourcePath?: string,
	'available through'?: string,
	$type: 'requirement',
	[key: string]: Mapped<ParsedHansonRequirement>,
}

export type HansonRequirement = {
	'children share courses'?: boolean,
	'student selected'?: boolean,
	contract?: boolean,
	declare?: Mapped<string>,
	description?: boolean,
	filter?: ?string,
	message?: string,
	result: string,
	[key: string]: Mapped<string | HansonRequirement>,
}

export type ParsedHansonRequirement = {
	$type: 'requirement',
	'children share courses'?: boolean,
	'student selected'?: boolean,
	contract?: boolean,
	declare?: Mapped<string>,
	description?: boolean,
	filter: ?Mapped<ParsedHansonRequirement>,
	message: ?string,
	result: Mapped<ParsedHansonRequirement>,
	[key: string]: Mapped<ParsedHansonRequirement>,
}
