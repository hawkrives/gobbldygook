import { status, text } from "@gob/lib"
import parseData from "./parse-data.ts"
import cleanPriorData from "./clean-prior-data.ts"
import storeData from "./store-data.ts"
import cacheItemHash from "./cache-item-hash.ts"
import type { Notification } from "./lib-dispatch.ts"
import type { InfoFileTypeEnum, InfoFileRef } from "./types.ts"

const fetchText = (url: string): Promise<string> => {
  return fetch(url).then(status).then(text)
}

export default function updateDatabase(
  type: InfoFileTypeEnum,
  infoFileBase: string,
  notification: Readonly<Notification>,
  { path, hash }: InfoFileRef,
): Promise<boolean> {
  console.log(`fetching ${path}`)
  // Append the hash, to act as a sort of cache-busting mechanism
  const url = `${infoFileBase}/${path}?v=${hash}`

  const nextStep = async (rawData: string) => {
    // now parse the data into a usable form
    const data = parseData(rawData, type)
    // clear out any old data
    await cleanPriorData(path, type)
    // store the new data
    await storeData(path, type, data)
    // record that we stored the new data
    await cacheItemHash(path, type, hash)
  }

  const onFailure = () => {
    console.warn(`Could not fetch ${url}`)
    notification.increment()
    return false
  }

  const onSuccess = () => {
    console.log(`added ${path}`)
    notification.increment()
    return true
  }

  // go fetch the data!
  return fetchText(url).then(nextStep).then(onSuccess).catch(onFailure)
}
