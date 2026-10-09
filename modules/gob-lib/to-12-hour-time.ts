import padStart from "lodash/padStart.js"

function split24HourTime(time: string): { hour: number; minute: number } {
  const [hour = "", minute = ""] = padStart(time, 5, "0").split(":")
  return {
    hour: parseInt(hour, 10),
    minute: parseInt(minute, 10),
  }
}

export function to12HourTime(time: string): string {
  const { hour, minute } = split24HourTime(time)
  const paddedMinute = padStart(String(minute), 2, "0")

  const fullHour = ((hour + 11) % 12) + 1
  const meridian = hour < 12 ? "am" : "pm"

  return `${fullHour}:${paddedMinute}${meridian}`
}
