jest.spyOn(global.console, "log").mockImplementation(() => jest.fn())
jest.spyOn(global.console, "error").mockImplementation(() => jest.fn())
jest.spyOn(global.console, "warn").mockImplementation(() => jest.fn())
jest.mock("@gob/web-database")
jest.mock("../lib-dispatch", () => {
  const NotificationMock = jest.fn(() => ({
    start: jest.fn(),
    increment: jest.fn(),
    remove: jest.fn(),
  }))
  return {
    refreshCourses: jest.fn(),
    refreshAreas: jest.fn(),
    quotaExceededError: jest.fn(),
    Notification: NotificationMock,
  }
})
jest.mock("../needs-update", () => jest.fn(() => Promise.resolve()))
jest.mock("../update-database", () => jest.fn(() => Promise.resolve()))
jest.mock("../remove-duplicate-areas", () => jest.fn(() => Promise.resolve()))
jest.mock("@gob/lib/fetch-helpers", () => {
  return {
    status: (x: unknown) => x,
    text: (x: unknown) => x,
  }
})
const goodFetch = jest.fn((url: string) =>
  Promise.resolve(
    JSON.stringify({
      url,
    }),
  ),
)
const badFetch = jest.fn(() => Promise.reject(new Error("could not fetch")))
// status and text are mocked to pass the fetched value straight through, so
// the fetch mock can resolve to plain values instead of Responses
const fetchMock = jest.fn<Promise<unknown>, [url: string]>(() => {
  throw new Error("you must pick either goodFetch or badFetch")
})
globalThis.fetch = fetchMock as unknown as typeof fetch
import { db } from "../db"
import type { InfoFileRef, InfoFileTypeEnum, InfoIndexFile } from "../types"
import * as dispatch from "../lib-dispatch"
import needsUpdate from "../needs-update"
import updateDatabase from "../update-database"
import removeDuplicateAreas from "../remove-duplicate-areas"
import loadFiles, * as load from "../load-files"
beforeEach(async () => {
  await db.__clear()
  jest.mocked(dispatch.quotaExceededError).mockClear()
  goodFetch.mockClear()
  badFetch.mockClear()
  jest.mocked(needsUpdate).mockClear()
  jest.mocked(updateDatabase).mockClear()
  jest.mocked(removeDuplicateAreas).mockClear()
})

const mockArgs = (type: InfoFileTypeEnum) => {
  return {
    type,
    notification: new dispatch.Notification("courses"),
    baseUrl: "url",
    oldestYear: 2000,
  }
}

describe("filterForRecentCourses", () => {
  test("only returns json filerefs", () => {
    const fileRefs: InfoFileRef[] = [
      {
        type: "json",
        year: 2000,
        path: "",
        hash: "",
      },
      {
        type: "xml",
        year: 2000,
        path: "",
        hash: "",
      },
      {
        type: "csv",
        year: 2000,
        path: "",
        hash: "",
      },
      {
        type: "json",
        year: 2000,
        path: "",
        hash: "",
      },
    ]
    const actual = fileRefs.filter((f) => load.filterForRecentCourses(f, 2000))
    const expected = fileRefs.filter((f) => f.type === "json")
    expect(actual).toEqual(expected)
  })
  test("only returns filerefs since $year", () => {
    const fileRefs: InfoFileRef[] = [
      {
        type: "json",
        year: 2000,
        path: "",
        hash: "",
      },
      {
        type: "json",
        year: 2001,
        path: "",
        hash: "",
      },
      {
        type: "json",
        year: 2002,
        path: "",
        hash: "",
      },
      {
        type: "json",
        year: 2003,
        path: "",
        hash: "",
      },
      {
        type: "json",
        year: 2004,
        path: "",
        hash: "",
      },
    ]
    const year = 2002
    const actual = fileRefs.filter((f) => load.filterForRecentCourses(f, year))
    const expected = fileRefs.filter((f) => (f.year ?? 0) >= year)
    expect(actual).toEqual(expected)
  })
})
describe("finishUp", () => {
  test("removes the notification", () => {
    const { type, notification } = mockArgs("areas")
    load.finishUp({
      type,
      notification,
      baseUrl: "url",
    })
    // oxlint-disable-next-line typescript/unbound-method -- a jest.fn() from the Notification mock; it is only inspected, never called
    expect(notification.remove).toHaveBeenCalledTimes(1)
  })
})
describe("deduplicateAreas", () => {
  test("calls removeDuplicateAreas if working on an area index", () => {
    void load.deduplicateAreas(mockArgs("areas"))
    expect(removeDuplicateAreas).toHaveBeenCalledTimes(1)
  })
  test("does not call removeDuplicateAreas unless working on an area index", () => {
    void load.deduplicateAreas(mockArgs("courses"))
    expect(removeDuplicateAreas).toHaveBeenCalledTimes(0)
  })
})
describe("slurpIntoDatabase", () => {
  test("exits early if no files are given", async () => {
    const args = mockArgs("courses")
    const fileRefs: InfoFileRef[] = []
    await load.slurpIntoDatabase(args, fileRefs)
    expect(updateDatabase).not.toHaveBeenCalled()
  })
  test("starts the notification", async () => {
    const args = mockArgs("courses")
    const fileRefs: InfoFileRef[] = [
      {
        type: "json",
        year: 2000,
        path: "",
        hash: "",
      },
      {
        type: "json",
        year: 2001,
        path: "",
        hash: "",
      },
    ]
    await load.slurpIntoDatabase(args, fileRefs)
    // oxlint-disable-next-line typescript/unbound-method -- a jest.fn() from the Notification mock; it is only inspected, never called
    expect(args.notification.start).toHaveBeenCalledTimes(1)
    // oxlint-disable-next-line typescript/unbound-method -- a jest.fn() from the Notification mock; it is only inspected, never called
    expect(args.notification.start).toHaveBeenCalledWith(fileRefs.length)
  })
  test("calls updateDatabase once for each file given", async () => {
    const args = mockArgs("courses")
    const fileRefs: InfoFileRef[] = [
      {
        type: "json",
        year: 2000,
        path: "",
        hash: "",
      },
      {
        type: "json",
        year: 2001,
        path: "",
        hash: "",
      },
      {
        type: "json",
        year: 2002,
        path: "",
        hash: "",
      },
      {
        type: "json",
        year: 2003,
        path: "",
        hash: "",
      },
    ]
    await load.slurpIntoDatabase(args, fileRefs)
    expect(updateDatabase).toHaveBeenCalledTimes(fileRefs.length)
  })
})
describe("filterFiles", () => {
  test("calls needsUpdate once per file", async () => {
    jest.mocked(needsUpdate).mockImplementation(() => Promise.resolve(true))
    const args = mockArgs("courses")
    const fileRefs: InfoFileRef[] = [
      {
        type: "json",
        year: 2000,
        path: "",
        hash: "",
      },
      {
        type: "json",
        year: 2001,
        path: "",
        hash: "",
      },
      {
        type: "json",
        year: 2002,
        path: "",
        hash: "",
      },
      {
        type: "json",
        year: 2003,
        path: "",
        hash: "",
      },
    ]
    await load.filterFiles(args.type, fileRefs)
    expect(needsUpdate).toHaveBeenCalledTimes(fileRefs.length)
  })
  test("returns only files that needsUpdate says need updates", async () => {
    jest
      .mocked(needsUpdate)
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() => Promise.resolve(false))
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() => Promise.resolve(false))
    const args = mockArgs("courses")
    const fileRefs: InfoFileRef[] = [
      {
        type: "json",
        year: 2000,
        path: "1.json",
        hash: "",
      },
      {
        type: "json",
        year: 2001,
        path: "2.json",
        hash: "",
      },
      {
        type: "json",
        year: 2002,
        path: "3.json",
        hash: "",
      },
      {
        type: "json",
        year: 2003,
        path: "4.json",
        hash: "",
      },
    ]
    const actual = await load.filterFiles(args.type, fileRefs)
    const expected = [fileRefs[0], fileRefs[2]]
    expect(actual).toEqual(expected)
    expect(needsUpdate).toHaveBeenCalledTimes(4)
  })
})
describe("getFilesToLoad", () => {
  test("returns the input array if loading areas", () => {
    const index: InfoIndexFile = {
      type: "areas",
      files: [
        {
          type: "yaml",
          path: "1.json",
          hash: "",
        },
        {
          type: "yaml",
          path: "2.json",
          hash: "",
        },
        {
          type: "yaml",
          path: "3.json",
          hash: "",
        },
        {
          type: "yaml",
          path: "4.json",
          hash: "",
        },
      ],
    }
    const actual = load.getFilesToLoad("areas", 0, index)
    expect(actual).toBe(index.files)
  })
  test("filters the input array if loading courses", () => {
    const index: InfoIndexFile = {
      type: "courses",
      files: [
        {
          type: "json",
          year: 2000,
          path: "1.json",
          hash: "",
        },
        {
          type: "json",
          year: 2001,
          path: "2.json",
          hash: "",
        },
        {
          type: "json",
          year: 2002,
          path: "3.json",
          hash: "",
        },
        {
          type: "json",
          year: 2003,
          path: "4.json",
          hash: "",
        },
      ],
    }
    const actual = load.getFilesToLoad("courses", 2002, index)
    const expected = index.files.filter((f) => (f.year ?? 0) >= 2002)
    expect(actual).toEqual(expected)
  })
})
describe("proceedWithUpdate", () => {
  test("calls the sequence of functions", async () => {
    const baseUrl = "remote"
    const index: InfoIndexFile = {
      type: "areas",
      files: [
        {
          type: "yaml",
          path: "1.json",
          hash: "",
        },
        {
          type: "yaml",
          path: "2.json",
          hash: "",
        },
        {
          type: "yaml",
          path: "3.json",
          hash: "",
        },
        {
          type: "yaml",
          path: "4.json",
          hash: "",
        },
      ],
    }
    await load.proceedWithUpdate(baseUrl, index)
    expect(needsUpdate).toHaveBeenCalled()
    expect(updateDatabase).toHaveBeenCalled()
    expect(removeDuplicateAreas).toHaveBeenCalled()
  })
  test("rejects if any fail", async () => {
    jest
      .mocked(needsUpdate)
      .mockImplementationOnce(() => Promise.reject(new Error("mock error")))
    const baseUrl = "remote"
    const index: InfoIndexFile = {
      type: "areas",
      files: [
        {
          type: "yaml",
          path: "1.json",
          hash: "",
        },
        {
          type: "yaml",
          path: "2.json",
          hash: "",
        },
        {
          type: "yaml",
          path: "3.json",
          hash: "",
        },
        {
          type: "yaml",
          path: "4.json",
          hash: "",
        },
      ],
    }
    expect.assertions(3)

    try {
      await load.proceedWithUpdate(baseUrl, index)
    } catch (_err) {
      expect(needsUpdate).toHaveBeenCalled()
      expect(updateDatabase).not.toHaveBeenCalled()
      expect(removeDuplicateAreas).not.toHaveBeenCalled()
    }
  })
})
describe("loadFiles", () => {
  test("calls fetch with the input url", async () => {
    const fetchResult: InfoIndexFile = {
      type: "areas",
      files: [
        {
          type: "yaml",
          path: "1.json",
          hash: "",
        },
        {
          type: "yaml",
          path: "2.json",
          hash: "",
        },
        {
          type: "yaml",
          path: "3.json",
          hash: "",
        },
        {
          type: "yaml",
          path: "4.json",
          hash: "",
        },
      ],
    }
    fetchMock.mockImplementationOnce(() => Promise.resolve(fetchResult))
    await loadFiles("some-url", "another-one")
    expect(fetchMock).toHaveBeenCalledWith("some-url")
  })
  test("rejects if the fetch fails", async () => {
    fetchMock.mockImplementationOnce(() =>
      Promise.reject(new Error("Other Error")),
    )
    expect.assertions(1)

    try {
      await loadFiles("some-url", "another-one")
    } catch (_err) {
      expect(fetchMock).toHaveBeenCalled()
    }
  })
  test("does not reject if the fetch fails with an offline error", async () => {
    fetchMock.mockImplementationOnce(() =>
      Promise.reject(new Error("Failed to fetch URL")),
    )
    expect.assertions(1)
    await loadFiles("some-url", "another-one")
    expect(fetchMock).toHaveBeenCalled()
  })
})
