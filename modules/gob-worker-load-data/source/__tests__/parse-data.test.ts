vi.spyOn(global.console, "log").mockImplementation(() => vi.fn())
vi.spyOn(global.console, "error").mockImplementation(() => vi.fn())
vi.spyOn(global.console, "warn").mockImplementation(() => vi.fn())
import parseData from "../parse-data.ts"
test("parseData can parse json", () => {
  expect(parseData('{"foo": 2}', "courses")).toMatchSnapshot()
})
test("parseData can parse yaml", () => {
  expect(parseData("foo: 2", "areas")).toMatchSnapshot()
})
test("parseData returns a blank object if it can't parse", () => {
  expect(parseData("foo: 2", "other")).toMatchSnapshot()
  expect(parseData("invalid", "courses")).toMatchSnapshot()
  expect(parseData("- invalid: yaml:", "areas")).toMatchSnapshot()
})
