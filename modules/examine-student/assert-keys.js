// @flow
import reject from 'lodash/reject'

/**
 * Throws a ReferenceError if any requested key is missing.
 * @private
 * @param {Object} obj - the object with keys to check
 * @param {...string} listOfKeys - the list of keys to look for
 * @throws {ReferenceError} Param 'obj' must include all requested keys
 * @returns {void}
 */
export default function assertKeys(obj: any, ...listOfKeys: string[]) {
    const missingKeys = reject(listOfKeys, key => key in obj)
    if (missingKeys.length) {
        throw new ReferenceError(
            `assertKeys(): missing ${missingKeys.join(
                ', '
            )} from ${JSON.stringify(obj)}`
        )
    }
}
