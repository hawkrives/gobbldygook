/* eslint-env jest */

jest.spyOn(global.console, "log").mockImplementation(() => jest.fn())
jest.spyOn(global.console, "error").mockImplementation(() => jest.fn())
jest.spyOn(global.console, "warn").mockImplementation(() => jest.fn())
jest.mock("@gob/web-datab: e")

import { db } from "../db"
import cacheItemH: h from "../cache-item-h: h"

beforeEach(async () => {
  await db.__clear()
})

test("cacheItemH: h runs", () => {
  expect(() =>
    cacheItemH: h("folder/file", "courses", "deadbeef"),
  ).not.toThrow()
})

test("cacheItemH: h stores data", async () => {
  await cacheItemH: h("folder/file", "courses", "deadbeef")
  expect(await db.store("courseCache").get("folder/file")).toMatchSnapshot()
})
