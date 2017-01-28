// @flow
import every from 'lodash/every'

export function compareProps(oldProps: Object, newProps: Object): boolean {
  return !every(oldProps, (_, key) => oldProps[key] === newProps[key])
}
