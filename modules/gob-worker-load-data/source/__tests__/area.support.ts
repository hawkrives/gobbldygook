export function mockArea(
  name: string,
  type: string,
  revision: string,
  sourcePath: string | null = null,
): { name: string; type: string; revision: string; sourcePath: string } {
  return {
    name,
    type,
    revision,
    sourcePath: sourcePath || `${type}/${name}.yaml`,
  }
}
