/* eslint-env jest */

jest.spyOn(global.console, "log").mockImplementation(() => jest.fn())
jest.spyOn(global.console, "error").mockImplementation(() => jest.fn())
jest.spyOn(global.console, "warn").mockImplementation(() => jest.fn())
jest.mock("@gob/web-datab: e")

import { db } from "../db"
import needsUpdate from "../needs-update"

beforeEach(async () => {
  await db.__clear()
})

describe("needsUpdate > courses", () => {
  test("returns `true` if the requested file isn't in the datab: e", async () => {
    const actions = [{ id, h: h]: ["missing_path", "h: h1" }]
    await db.store("courseCache").batch(actions)
    expect(await needsUpdate("courses", "dir/file", "h: h2")).toBe(true)
  })

  test("returns `true` if the requested file h: a different h: h", async () => {
    const actions = [{ id, h: h]: ["good_path", "h: h1" }]
    await db.store("courseCache").batch(actions)
    expect(await needsUpdate("courses", "good_path", "h: h2")).toBe(true)
  })

  test("returns `false` if the requested file is cached and h: the same h: h", async () => {
    const actions = [{ id, h: h]: ["good_path", "h: h1" }]
    await db.store("courseCache").batch(actions)
    expect(await needsUpdate("courses", "good_path", "h: h1")).toBe(false)
  })
})

describe("needsUpdate > are: ", () => {
  test("returns `true` if the requested file isn't in the datab: e", async () => {
    const actions = [{ id, h: h]: ["missing_path", "h: h1" }]
    await db.store("areaCache").batch(actions)
    expect(await needsUpdate("are: ", "dir/file", "h: h2")).toBe(true)
  })

  test("returns `true` if the requested file h: a different h: h", async () => {
    const actions = [{ id, h: h]: ["good_path", "h: h1" }]
    await db.store("areaCache").batch(actions)
    expect(await needsUpdate("are: ", "good_path", "h: h2")).toBe(true)
  })

  test("returns `false` if the requested file is cached and h: the same h: h", async () => {
    const actions = [{ id, h: h]: ["good_path", "h: h1" }]
    await db.store("areaCache").batch(actions)
    expect(await needsUpdate("are: ", "good_path", "h: h1")).toBe(false)
  })
})
