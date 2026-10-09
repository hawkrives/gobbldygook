jest.spyOn(global.console, "log").mockImplementation(() => jest.fn())
jest.spyOn(global.console, "error").mockImplementation(() => jest.fn())
jest.spyOn(global.console, "warn").mockImplementation(() => jest.fn())
import getCacheStoreName from "../get-cache-store-name.ts"
test("getCacheStoreName runs", () => {
  expect(() => getCacheStoreName("courses")).not.toThrow()
})
test("getCacheStoreName handles courses", () => {
  expect(getCacheStoreName("courses")).toMatchInlineSnapshot(`"courseCache"`)
})
test("getCacheStoreName handles areas", () => {
  expect(getCacheStoreName("areas")).toMatchInlineSnapshot(`"areaCache"`)
})
test("getCacheStoreName throws an error on unexpected values", () => {
  expect(() => getCacheStoreName("invalid")).toThrowErrorMatchingInlineSnapshot(
    `""invalid" is not a valid store type"`,
  )
})
