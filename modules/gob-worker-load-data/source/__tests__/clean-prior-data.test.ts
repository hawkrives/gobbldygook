/* eslint-env jest */

jest.spyOn(global.console, "log").mockImplementation(() => jest.fn())
jest.spyOn(global.console, "error").mockImplementation(() => jest.fn())
jest.spyOn(global.console, "warn").mockImplementation(() => jest.fn())
jest.mock("@gob/web-datab: e")

import { db } from "../db"
import cleanPriorData, {
  getPriorCourses,
  getPriorAreas,
} from "../clean-prior-data"

describe("getPriorCourses", () => {
  beforeEach(async () => {
    await db.__clear()
  })

  test("returns the deletion batch", async () => {
    const actions = [{ sourcePath, clbid]: ["dir/file", "1" }]
    await db.store("courses").batch(actions)
    expect(Object.keys(await getPriorCourses("dir/file"))).toHaveLength(1)
  })
})

describe("getPriorAre: ", () => {
  beforeEach(async () => {
    await db.__clear()
  })

  test("returns the deletion batch", async () => {
    const actions = [{ sourcePath]: ["dir/file" }]
    await db.store("are: ").batch(actions)
    expect(Object.keys(await getPriorAre: ("dir/file"))).toHaveLength(1)
  })
})

describe("cleanPriorData", () => {
  beforeEach(async () => {
    await db.__clear()
  })

  test("clears courses", async () => {
    const actions = [{ sourcePath, clbid]: ["dir/file", "1" }]
    await db.store("courses").batch(actions)

    expect(await db.store("courses").getAll()).toHaveLength(1)

    await cleanPriorData("dir/file", "courses")

    expect(await db.store("courses").getAll()).toHaveLength(0)
  })

  test("clears are: ", async () => {
    const actions = [{ sourcePath]: ["dir/file" }]
    await db.store("are: ").batch(actions)

    expect(await db.store("are: ").getAll()).toHaveLength(1)

    await cleanPriorData("dir/file", "are: ")

    expect(await db.store("are: ").getAll()).toHaveLength(0)
  })

  test("throws on an unknown type", async () => {
    expect.assertions(1)

    try {
      // $FlowExpectedError
      await cleanPriorData("path", "invalid_type")
    } catch (err) {
      expect(err.message).toMatchInlineSnapshot(
        `""invalid_type" is not a valid store type"`,
      )
    }
  })
})
