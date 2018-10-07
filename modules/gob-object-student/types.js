// @flow

import type {CourseError, Course as CourseType} from '@gob/types'
export type {CourseError, CourseType}
import {List} from 'immutable'

export type AreaQuery = {
	type: string,
	name: string,
	revision: string,
}

export type OverrideType = mixed

export type FabricationType = {|
	+clbid: string,
	+credits: number,
	+department: string,
	+gereqs: Array<string>,
	+name: string,
	+number: number,
	+section: string,
	+semester: number,
	+term: number,
	+year: number,
|}

export type FulfillmentType = {||}

export type CourseLookupFunc = (
	{clbid: string, term?: ?number},
	?(Array<FabricationType> | List<FabricationType>),
) => Promise<CourseType | FabricationType | CourseError>

export type OnlyCourseLookupFunc = ({
	clbid: string,
	term: number,
}) => Promise<?CourseType>
