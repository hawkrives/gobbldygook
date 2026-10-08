// A single value in a query, after buildQueryFromString has cleaned it up.
// Strings starting with "$" are boolean operators ("$AND", "$OR", ...).
export type QueryValue = string | number | boolean

// The query object that buildQueryFromString produces: each course field
// maps to the values to look for, optionally led by a boolean operator.
export type Query = Readonly<Record<string, ReadonlyArray<QueryValue>>>

// Anything with fields a query can check, usually a Course.
export type Queryable = Readonly<Record<string, unknown>>
