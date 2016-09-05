// @flow

// Clean a timestring segment by uppercasing and trimming it.
export default function cleanTimestringSegment(segment: string): string {
	const uppercased = segment.toUpperCase()
	const trimmed = uppercased.trim()
	return trimmed
}
