jest.spyOn(global.console, "log").mockImplementation(() => jest.fn())
jest.spyOn(global.console, "error").mockImplementation(() => jest.fn())
jest.spyOn(global.console, "warn").mockImplementation(() => jest.fn())
jest.mock("@gob/web-database")
import { db } from "../db.ts"
import storeData, { storeArea, storeCourses } from "../store-data.ts"
import { mockArea } from "./area.support.ts"
import { mockCourse } from "./course.support.ts"
beforeEach(async () => {
  await db.__clear()
})
describe("storeArea", () => {
  test("stores the passed area", async () => {
    const area = mockArea("CSCI", "major", "2012-13")
    await storeArea(area.sourcePath, area)
    const actual = (await db.store("areas").getAll())[0]
    expect(actual).toMatchObject(area)
  })
})
describe("storeCourses", () => {
  test("stores the given courses", async () => {
    const courses = [
      mockCourse({
        clbid: 1,
        number: 101,
        name: "florp",
      }),
      mockCourse({
        clbid: 2,
        number: 102,
        name: "bord",
      }),
      mockCourse({
        clbid: 3,
        title: "bar",
      }),
      mockCourse({
        clbid: 4,
        times: ["T 1130-1230"],
      }),
    ]
    await storeCourses("terms/20161.json", courses)
    const actual = await db.store("courses").getAll()
    expect(actual).toMatchObject(courses)
  })
})
describe("storeData", () => {
  test('does not throw when storing "courses"', async () => {
    expect.assertions(0)

    try {
      await storeData("terms/20161.json", "courses", [])
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })
  test('does not throw when storing "areas"', async () => {
    expect.assertions(0)

    try {
      const area = mockArea("CSCI", "major", "2012-13")
      await storeData("majors/csci.yaml", "areas", area)
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })
})
