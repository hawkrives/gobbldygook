import { selectAll } from 'css-select'
import map from 'lodash/map'
import filter from 'lodash/filter'
import uniq from 'lodash/uniq'

export function extractStudentIds(dom) {
  let idElements = selectAll('[name=stnum]', dom)
  return uniq(map(filter(idElements, el => el), el => Number(el.attribs.value)))
}
