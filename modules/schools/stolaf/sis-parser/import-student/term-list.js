import { selectOne, selectAll } from 'css-select'

export function extractTermList(dom) {
  const termSelector = selectOne('[name=searchyearterm]', dom)
  if (termSelector === null) {
    return []
  }

  const options = selectAll('option', termSelector)
  if (!options.length) {
    return []
  }

  return options.map(opt => Number(opt.attribs.value))
}
