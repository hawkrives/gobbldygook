// @flow

export type AreaOfStudyType = {|
	'available through'?: number,
	name: string,
	type: string,
	revision: string,
|}

export type AreaQuery = {|
	type: string,
	name: string,
|}

export type OverrideType = {||}

export type FabricationType = {|
	clbid: string,
|}

export type FulfillmentType = {||}
