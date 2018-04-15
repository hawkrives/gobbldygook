export function mockArea(name, type, revision, sourcePath = null) {
    return {
        name,
        type,
        revision,
        sourcePath: sourcePath || `${type}/${name}.yaml`,
    }
}
