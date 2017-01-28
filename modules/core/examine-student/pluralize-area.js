// @flow
import type { AreaOfStudyTypeEnum } from './types'
/**
 * Pluralizes an area type
 * @private
 * @param {string} type - the type to pluralize
 * @returns {string} - the pluralized type
 */
export default function pluralizeArea(type: AreaOfStudyTypeEnum) {
  switch (type.toLowerCase()) {
    case 'degree':
      return 'degrees'
    case 'major':
      return 'majors'
    case 'concentration':
      return 'concentrations'
    case 'emphasis':
      return 'emphases'
    default:
      throw new Error(`unrecognized area type ${type}!`)
  }
}
