jest.spyOn(global.console, "log").mockImplementation(() => jest.fn())
jest.spyOn(global.console, "error").mockImplementation(() => jest.fn())
jest.spyOn(global.console, "warn").mockImplementation(() => jest.fn())
jest.mock("@gob/web-database")
import { db } from "../db.ts"
import cacheItemHash from "../cache-item-hash.ts"
beforeEach(async () => {
  await db.__clear()
})
test("cacheItemHash runs", () => {
  expect(() =>
    cacheItemHash("folder/file", "courses", "deadbeef"),
  ).not.toThrow()
})
test("cacheItemHash stores data", async () => {
  await cacheItemHash("folder/file", "courses", "deadbeef")
  expect(await db.store("courseCache").get("folder/file")).toMatchSnapshot()
})
