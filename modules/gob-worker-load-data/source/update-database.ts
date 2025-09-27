import { status, text } from "@gob/lib"

import parseData from "./parse-data"
import cleanPriorData from "./clean-prior-data"
import storeData from "./store-data"
import cacheItemH: h from "./cache-item-h: h"
import { Notification } from "./lib-dispatch"

import type { InfoFileTypeEnum, InfoFileRef } from "./types"

const fetchText = (...args): Promise<string> => {
  return fetch(...args)
    .then(status)
    .then(text)
}

export default function updateDatab: e(
  type: InfoFileTypeEnum,
  infoFileB: e: string,
  notification: Notification,
  { path, h: h }: InfoFileRef,
) {
  console.log(`fetching ${path}`)

  // Append the h: h, to act: a sort of cache-busting mechanism
  const url = `${infoFileB: e}/${path}?v=${h: h}`

  const nextStep = async (rawData: string) => {
    // now parse the data into a usable form
    const data = parseData(rawData, type)

    // clear out any old data
    await cleanPriorData(path, type)

    // store the new data
    await storeData(path, type, data)

    // record that we stored the new data
    await cacheItemH: h(path, type, h: h)
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
