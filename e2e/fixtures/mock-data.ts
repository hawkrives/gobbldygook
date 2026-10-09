// Routes the app's external data requests to the fixtures in ./data.ts and
// blocks every other request that would leave localhost.
//
// Routes are installed on the browser context rather than the page so they
// also cover requests made from the app's web workers.

import type { BrowserContext, Route } from "@playwright/test"
import {
  AREA_DATA_BASE,
  COURSE_DATA_BASE,
  allCourses,
  areaInfo,
  areas,
  courseInfo,
  coursesForTerm,
} from "./data.ts"

const cors = { "Access-Control-Allow-Origin": "*" }

function json(route: Route, body: unknown) {
  return route.fulfill({
    status: 200,
    contentType: "application/json",
    headers: cors,
    body: JSON.stringify(body),
  })
}

function text(route: Route, body: string) {
  return route.fulfill({
    status: 200,
    contentType: "text/plain",
    headers: cors,
    body,
  })
}

function notFound(route: Route) {
  return route.fulfill({ status: 404, headers: cors, body: "not found" })
}

function pathUnder(base: string, route: Route) {
  let { pathname } = new URL(route.request().url())
  return pathname.slice(new URL(base).pathname.length + 1)
}

export async function mockCourseAndAreaData(context: BrowserContext) {
  // The app reads these two files from its own origin to find the data hosts.
  await context.route("**/courseData.url", (route) =>
    text(route, COURSE_DATA_BASE),
  )
  await context.route("**/areaData.url", (route) => text(route, AREA_DATA_BASE))

  await context.route(`${COURSE_DATA_BASE}/**`, (route) => {
    let path = pathUnder(COURSE_DATA_BASE, route)

    if (path === "info.json") {
      return json(route, courseInfo())
    }

    let term = /^terms\/(\d{4})(\d)\.json$/.exec(path)
    if (term) {
      return json(route, coursesForTerm(Number(term[1]), Number(term[2])))
    }

    // getCourseFromNetwork() falls back to courses/<dir>/<clbid>.json
    let single = /^courses\/\d+\/(\d+)\.json$/.exec(path)
    if (single) {
      let found = allCourses().find((c) => c.clbid === single[1])
      return found ? json(route, found) : notFound(route)
    }

    return notFound(route)
  })

  await context.route(`${AREA_DATA_BASE}/**`, (route) => {
    let path = pathUnder(AREA_DATA_BASE, route)

    if (path === "info.json") {
      return json(route, areaInfo())
    }
    if (path in areas) {
      return text(route, areas[path])
    }
    return notFound(route)
  })

  // Anything else off-box (analytics, error reporting) is dropped so the
  // suite never depends on the network.
  await context.route(
    (url) =>
      url.hostname !== "localhost" &&
      url.hostname !== "127.0.0.1" &&
      !url.href.startsWith(COURSE_DATA_BASE) &&
      !url.href.startsWith(AREA_DATA_BASE),
    (route) => route.abort(),
  )
}
