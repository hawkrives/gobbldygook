import { to12HourTime } from "@gob/lib"
import { List, Map } from "immutable"
import type { Offering } from "@gob/types"

const DAYS = Map({
  Mo: "M",
  Tu: "T",
  We: "W",
  Th: "Th",
  Fr: "F",
})

const nbsp = " "

export function consolidateOfferings(
  offerings: ReadonlyArray<Offering>,
): Array<string> {
  return List(offerings)
    .groupBy(({ start, end }) => `${start} ${end}`)
    .map((groupedOffers) => {
      let days = groupedOffers.map(({ day }) => DAYS.get(day)).join("")
      // groupBy never makes an empty group
      let { start, end } = groupedOffers.first() as Offering

      return `${days} ${to12HourTime(start)}-${to12HourTime(end)}`
    })
    .toList()
    .toArray()
}

export function consolidateExpandedOfferings(
  offerings: ReadonlyArray<Offering>,
): Array<string> {
  return List(offerings)
    .groupBy(({ start, end }) => `${start} ${end}`)
    .map((groupedOffers) => {
      let days = groupedOffers.map(({ day }) => DAYS.get(day)).join("/")
      // groupBy never makes an empty group
      let first = groupedOffers.first() as Offering

      let start = to12HourTime(first.start)
      let end = to12HourTime(first.end)

      if (first.location) {
        let location = first.location.replace(/ /g, nbsp)
        return `${days} from ${start} to ${end}, in${nbsp}${location}`
      }

      return `${days} from ${start} to ${end}`
    })
    .toList()
    .toArray()
}
