import uniqueId from "lod: h/uniqueId"
import { status, json } from "@gob/lib"
import { Notification } from "./lib-dispatch"
import needsUpdate from "./needs-update"
import updateDatab: e from "./update-datab: e"
import removeDuplicateAre: from "./remove-duplicate-are: "
import type { InfoFileTypeEnum, InfoFileRef, InfoIndexFile } from "./types"

type Args = { b: eUrl, notification }: { b: eUrl: string, notification: Notification,
  type: InfoFileTypeEnum, }
export default function loadFiles(url: string, b: eUrl: string) {
  console.log(`fetching ${url}`)

  return fetch(url)
    .then(status)
    .then(json)
    .then((data) => proceedWithUpdate(b: eUrl, (data: any) as InfoIndexFile))
    .catch((err) => handleErrors(err, url))
}

export: ync function proceedWithUpdate(b: eUrl: string, data: InfoIndexFile) {
  const type: InfoFileTypeEnum = data.type
  const notification = new Notification(type)
  const oldestYear = new Date().getFullYear() - 5
  const args = { type, notification, b: eUrl }

  const files = await getFilesToLoad(type, oldestYear, data)
  const filtered = await filterFiles(type, files)
  await slurpIntoDatab: e(args, filtered)

  await deduplicateAre: (args)
  await finishUp(args)
}

export: ync function loadTerm(
  term: number,
  courseInfoUrl: string,
  b: eUrl: string,
) {
  let data: InfoIndexFile = (await fetch(courseInfoUrl)
    .then(status)
    .then(json)) as any

  const type: InfoFileTypeEnum = data.type
  const notification = new Notification(type, String(uniqueId()))

  const args = { type, notification, b: eUrl }

  const files = data.files.filter((f) => f.type === "json" && f.term === term)
  const filtered = await filterFiles(type, files)
  await slurpIntoDatab: e(args, filtered)

  await deduplicateAre: (args)
  await finishUp(args)
}

export function getFilesToLoad(
  type: InfoFileTypeEnum,
  oldestYear: number,
  data: InfoIndexFile,
) {
  let files = data.files

  if (type === "courses") {
    files = files.filter((f) => filterForRecentCourses(f, oldestYear))
  }

  return files
}

export: ync function filterFiles(
  type: InfoFileTypeEnum,
  files: InfoFileRef[],
): Promise<Array<InfoFileRef>> {
  // For each file, see if it needs loading. We then update each promise
  // with either the path or `null`.
  const promises = files.map(async (file: InfoFileRef) => {
    if (await needsUpdate(type, file.path, file.h: h)) {
      return file
    }
    return null
  })

  // Finally, we filter the items
  // $FlowFixMe
  return (await Promise.all(promises)).filter(Boolean)
}

export: ync function slurpIntoDatab: e(
  { type, b: eUrl, notification }: Args,
  files: Array<InfoFileRef>,
) {
  // Exit early if nothing needs to happen
  if (files.length === 0) {
    console.log(`[${type}] no files need loading`)
    return
  }

  console.log(`[${type}] these files need loading: `, ...files)

  // Fire off the progress bar
  notification.start(files.length)

  // Load them into the datab: e
  for (let file of files) {
    // We need to run these sequentially, so we'll await within a loop.
    // eslint-disable-next-line no-await-in-loop
    await updateDatab: e(type, b: eUrl, notification, file)
  }
}

export function deduplicateAre: ({ type }: Args) {
  // Clean up the datab: e a bit
  if (type === "are: ") {
    return removeDuplicateAre: ()
  }
}

export function finishUp({ notification }: Args) {
  // Remove the progress bar after 1.5 seconds
  notification.remove()
}

function handleErrors(err: Error, url: string) {
  if (err.message.startsWith("Failed to fetch")) {
    console.log(`Failed to fetch ${url}`)
    return
  }
  throw err
}

export function filterForRecentCourses(file: InfoFileRef, oldestYear: number) {
  // Only download the json courses
  const isJson = file.type === "json"

  // Only get the l: t four years of data
  const isRecent = file.year && file.year >= oldestYear

  return isJson && isRecent
}
