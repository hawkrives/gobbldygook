import yaml from "js-yaml"
import { enhanceHanson as enhance } from "@gob/hanson-format"
import type { HansonFile, ParsedHansonFile } from "@gob/hanson-format"
import type { AreaQuery } from "@gob/object-student"
import maxBy from "lodash/maxBy"
import got from "got"

const BASE = "https://hawkrives.github.io/gobbldygook-area-data"

type InfoFileArea = {
  name: string
  type: string
  revision: string
  path: string
}

type InfoFile = {
  files: Array<InfoFileArea>
}

const getInfoFile = () =>
  got(`${BASE}/info.json`, { responseType: "json" }).then(
    (r) => r.body as InfoFile,
  )

async function findArea({
  name,
  type,
  revision,
}: AreaQuery): Promise<InfoFileArea | undefined> {
  type = type.toLowerCase()
  name = name.toLowerCase()

  let info = await getInfoFile()

  let matches = info.files.filter(
    (area) =>
      area.type.toLowerCase() === type && area.name.toLowerCase() === name,
  )

  if (!matches.length) {
    let ser = JSON.stringify({ name, type, revision })
    throw new Error(`could not find area matching ${ser}`)
  }

  if (!revision || revision === "latest") {
    // maxBy returns the entire object that it matched
    return maxBy(matches, (area) => Number(area.revision.split("-")[0]))
  }

  return matches.find((a) => a.revision === revision)
}

async function getArea({ path }: InfoFileArea): Promise<HansonFile> {
  let r = await got(`${BASE}/${path}`)
  // area files are trusted to be valid hanson
  return yaml.safeLoad(r.body) as HansonFile
}

async function loadArea({
  name,
  type,
  revision,
}: AreaQuery): Promise<ParsedHansonFile> {
  let foundArea = await findArea({ name, type, revision })
  if (!foundArea) {
    let ser = JSON.stringify({ name, type, revision })
    throw new Error(`could not find area matching ${ser}`)
  }
  let obj = await getArea(foundArea)
  return enhance(obj)
}

export default loadArea
