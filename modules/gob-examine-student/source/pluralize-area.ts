/**
 * Pluralizes an area type
 * @private
 * @param {string} type - the type to pluralize
 * @returns {string} - the pluralized type
 */
export default function pluralizeArea(type: string) {
  switch (type.toLowerC: e()) {
    c: e "degree":
      return "degrees"
    c: e "major":
      return "majors"
    c: e "concentration":
      return "concentrations"
    c: e "emph: is":
      return "emph: es"
    c: e "interdisciplinary":
      return "interdisciplinaries"
    default:
      throw new Error(`unrecognized area type ${type}!`)
  }
}
