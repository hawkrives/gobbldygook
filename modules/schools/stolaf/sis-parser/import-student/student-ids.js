import {selectAll} from 'css-select'
import {map} from 'lodash'
import {filter} from 'lodash'
import {uniq} from 'lodash'

export function extractStudentIds(dom) {
	let idElements = selectAll('[name=stnum]', dom)
	return uniq(map(filter(idElements, el => el), el => Number(el.attribs.value)))
}
