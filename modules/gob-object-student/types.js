// @flow

import type {CourseError, Course as CourseType} from '@gob/types'
export type {CourseError, CourseType}

export type AreaOfStudyType = {
	name: string,
	type: string,
	revision: string,
}

export type HydratedAreaOfStudyType = {|
	...$Exact<AreaOfStudyType>,
	// TODO: properly type _area
	_area: {
		result: {$type: 'of', $of: Array<string>},
	},
	_error: false,
	_checked: boolean,
	_progress: {at: number, of: number},
|}

export type AreaOfStudyEvaluationError = {|
	_error: string,
|}

export type AreaQuery = {
	type: string,
	name: string,
	revision?: string,
}

export type OverrideType = {||}

export type FabricationType = {|
	+clbid: string,
	+credits: number,
	+department: string,
	+gereqs: Array<string>,
	+name: string,
	+number: number,
	+section: string,
	+semester: number,
	+year: number,
|}

export type FulfillmentType = {||}

export type CourseLookupFunc = (
	{clbid: string, term: number},
	?{[key: string]: FabricationType},
	?{includeErrors?: boolean},
) => Promise<CourseType | FabricationType | CourseError>

export type OnlyCourseLookupFunc = ({
	clbid: string,
	term: number,
}) => Promise<?CourseType>
