vi.spyOn(global.console, "log").mockImplementation(() => vi.fn())
vi.spyOn(global.console, "error").mockImplementation(() => vi.fn())
vi.spyOn(global.console, "warn").mockImplementation(() => vi.fn())
vi.mock("@gob/web-database")
vi.mock("../lib-dispatch.ts", () => {
  // Called with `new`, so the implementation can't be an arrow function
  const NotificationMock = vi.fn(function () {
    return {
      start: vi.fn(),
      increment: vi.fn(),
      remove: vi.fn(),
    }
  })
  return {
    quotaExceededError: vi.fn(),
    Notification: NotificationMock,
  }
})
vi.mock("../clean-prior-data.ts", () => ({ default: vi.fn() }))
vi.mock("../store-data.ts", () => ({ default: vi.fn() }))
vi.mock("../parse-data.ts", () => ({ default: vi.fn() }))
vi.mock("../cache-item-hash.ts", () => ({ default: vi.fn() }))
vi.mock("@gob/lib/fetch-helpers.ts", () => {
  return {
    status: (x: unknown) => x,
    text: (x: unknown) => x,
  }
})
const goodFetch = vi.fn((url: string) =>
  Promise.resolve(
    JSON.stringify({
      url,
    }),
  ),
)
const badFetch = vi.fn(() => Promise.reject(new Error("could not fetch")))
// status and text are mocked to pass the fetched value straight through, so
// the fetch mock can resolve to plain values instead of Responses
const fetchMock = vi.fn<(url: string) => Promise<unknown>>(() => {
  throw new Error("you must pick either goodFetch or badFetch")
})
globalThis.fetch = fetchMock as unknown as typeof fetch
import { db } from "../db.ts"
import cleanPriorData from "../clean-prior-data.ts"
import * as dispatch from "../lib-dispatch.ts"
import storeData from "../store-data.ts"
import cacheItemHash from "../cache-item-hash.ts"
import updateDatabase from "../update-database.ts"
beforeEach(async () => {
  await db.__clear()
  goodFetch.mockClear()
  badFetch.mockClear()
  vi.mocked(cleanPriorData).mockClear()
  vi.mocked(dispatch.quotaExceededError).mockClear()
  vi.mocked(storeData).mockClear()
  vi.mocked(cacheItemHash).mockClear()
})
describe("updateDatabase", () => {
  test("calls fetch with an url", async () => {
    fetchMock.mockImplementationOnce(goodFetch)
    await updateDatabase(
      "courses",
      "http://unique.com/",
      new dispatch.Notification("courses"),
      {
        type: "json",
        path: "folder/file.json",
        hash: "badidea",
      },
    )
    expect(fetchMock).toHaveBeenLastCalledWith(
      "http://unique.com//folder/file.json?v=badidea",
    )
  })
  describe("calls an internal callback", () => {
    test("the onFailure callback if fetch rejects", async () => {
      fetchMock.mockImplementationOnce(badFetch)
      const result = await updateDatabase(
        "courses",
        "http://i.am.an.url/",
        new dispatch.Notification("courses"),
        {
          type: "json",
          path: "terms/20161.json",
          hash: "deadbeef",
        },
      )
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(result).toBe(false)
    })
    test("the nextStep callback if fetch resolves", async () => {
      fetchMock.mockImplementationOnce(goodFetch)
      const result = await updateDatabase(
        "courses",
        "http://i.am.an.url/",
        new dispatch.Notification("courses"),
        {
          type: "json",
          path: "terms/20161.json",
          hash: "deadbeef",
        },
      )
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(result).toBe(true)
    })
  })
  describe("increments the notification", () => {
    test("even if the fetch works", async () => {
      fetchMock.mockImplementationOnce(goodFetch)
      const n = new dispatch.Notification("courses")
      await updateDatabase("courses", "http://i.am.an.url/", n, {
        type: "json",
        path: "terms/20161.json",
        hash: "deadbeef",
      })
      // oxlint-disable-next-line typescript/unbound-method -- a vi.fn() from the Notification mock; it is only inspected, never called
      expect(n.increment).toHaveBeenCalledTimes(1)
    })
    test("even if the fetch fails", async () => {
      fetchMock.mockImplementationOnce(badFetch)
      const n = new dispatch.Notification("courses")
      await updateDatabase("courses", "http://i.am.an.url/", n, {
        type: "json",
        path: "terms/20161.json",
        hash: "deadbeef",
      })
      // oxlint-disable-next-line typescript/unbound-method -- a vi.fn() from the Notification mock; it is only inspected, never called
      expect(n.increment).toHaveBeenCalledTimes(1)
    })
  })
  test("calls a sequence of functions", async () => {
    fetchMock.mockImplementationOnce(goodFetch)
    await updateDatabase(
      "courses",
      "http://i.am.an.url/",
      new dispatch.Notification("courses"),
      {
        type: "json",
        path: "terms/20161.json",
        hash: "deadbeef",
      },
    )
    expect(cleanPriorData).toHaveBeenCalledTimes(1)
    expect(storeData).toHaveBeenCalledTimes(1)
    expect(cacheItemHash).toHaveBeenCalledTimes(1)
  })
  test("aborts the sequence if one rejects", async () => {
    fetchMock.mockImplementationOnce(goodFetch)
    vi.mocked(cleanPriorData).mockImplementationOnce(() =>
      Promise.reject(new Error("problem")),
    )
    expect.assertions(3)
    await updateDatabase(
      "courses",
      "http://i.am.an.url/",
      new dispatch.Notification("courses"),
      {
        type: "json",
        path: "terms/20161.json",
        hash: "deadbeef",
      },
    )
    expect(cleanPriorData).toHaveBeenCalledTimes(1)
    expect(storeData).not.toHaveBeenCalled()
    expect(cacheItemHash).not.toHaveBeenCalled()
  })
  describe("returns", () => {
    test("false if the fetch fails", async () => {
      fetchMock.mockImplementationOnce(badFetch)
      const value = await updateDatabase(
        "courses",
        "http://i.am.an.url/",
        new dispatch.Notification("courses"),
        {
          type: "json",
          path: "terms/20161.json",
          hash: "deadbeef",
        },
      )
      expect(value).toBe(false)
    })
    test("false if any step fails", async () => {
      fetchMock.mockImplementationOnce(goodFetch)
      vi.mocked(storeData).mockImplementationOnce(() =>
        Promise.reject(new Error("problem")),
      )
      const value = await updateDatabase(
        "courses",
        "http://i.am.an.url/",
        new dispatch.Notification("courses"),
        {
          type: "json",
          path: "terms/20161.json",
          hash: "deadbeef",
        },
      )
      expect(value).toBe(false)
    })
    test("true if no steps fail", async () => {
      fetchMock.mockImplementationOnce(goodFetch)
      const value = await updateDatabase(
        "courses",
        "http://i.am.an.url/",
        new dispatch.Notification("courses"),
        {
          type: "json",
          path: "terms/20161.json",
          hash: "deadbeef",
        },
      )
      expect(value).toBe(true)
    })
  })
})
