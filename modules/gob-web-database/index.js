/* eslint-disable camelcase */
// @flow

import { identifier, raw, sql, query } from "@electric-sql/pglite/template"
import { PGliteWorker } from "@electric-sql/pglite/worker"
import { live } from "@electric-sql/pglite/live"
// import { bloom } from "@electric-sql/pglite/contrib/bloom"
// import { btree_gin } from "@electric-sql/pglite/contrib/btree_gin"
// import { btree_gist } from "@electric-sql/pglite/contrib/btree_gist"
// import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm"

const workerUrl = new URL("./worker.js", import.meta.url)
const worker = new Worker(workerUrl, { type: "module" })
export const db = await PGliteWorker.create(worker, {
  dataDir: "idb://gobbldygook-pglite",
  relaxedDurability: true,
  extensions: {
    live,
    // bloom,
    // btree_gin,
    // btree_gist,
    // pg_trgm,
  },
})

console.log('"gob-web-database" module initialized with PGliteWorker.')

export async function migrate() {
  await db.transaction(async (tx) => {
    await tx.exec(`
      CREATE EXTENSION IF NOT EXISTS live;
      CREATE EXTENSION IF NOT EXISTS bloom;
      CREATE EXTENSION IF NOT EXISTS btree_gin;
      CREATE EXTENSION IF NOT EXISTS btree_gist;
      CREATE EXTENSION IF NOT EXISTS pg_trgm;
    `)

    await tx.exec(`
      CREATE TABLE IF NOT EXISTS areas (
        id TEXT PRIMARY KEY NOT NULL,
        data JSONB
      );
    `)

    await tx.exec(`
      CREATE TABLE IF NOT EXISTS areaCache (
        id TEXT PRIMARY KEY NOT NULL,
        data JSONB
      );
    `)

    await tx.exec(`
      CREATE TABLE IF NOT EXISTS courseCache (
        id TEXT PRIMARY KEY NOT NULL,
        data JSONB
      );
    `)

    await tx.exec(`
      CREATE TABLE IF NOT EXISTS courses (
        clbid TEXT PRIMARY KEY NOT NULL,
        crsid TEXT,
        credits NUMERIC,            
        dept TEXT,
        deptnum TEXT,
        department TEXT,
        gereqs TEXT[],
        groupid TEXT,
        grouptype TEXT,
        halfcredit BOOLEAN,
        level TEXT,
        name TEXT,  
        notes TEXT,
        number TEXT[],
        pf BOOLEAN, 
        places TEXT[],
        profs TEXT[],
        section TEXT,
        semester TEXT,
        term TEXT,
        title TEXT,
        type TEXT,
        year NUMERIC,
        sourcePath TEXT,
        words TEXT[],
        profWords TEXT[]
      );
    `)

    console.log("Database schema migrated successfully.")
  })
}

/**
 * @param {Array<Object>} courses - courses
 * @returns {Promise<void>} - resolves when courses are inserted
 */
export async function insertCourses(courses) {
  await db.transaction(async (tx) => {
    // TODO: figure out how to do this in a batch
    for (const course of courses) {
      // eslint-disable-next-line no-await-in-loop
      await tx.sql`
        INSERT INTO courses (
          clbid, crsid, credits, dept, 
          deptnum, department, gereqs, groupid, 
          grouptype, halfcredit, level, name, 
          notes, number, pf, places, 
          profs, section, semester, term, 
          title, type, year, sourcePath, 
          words, profWords
        ) VALUES (
          ${course.clbid}, ${course.crsid}, ${course.credits}, ${course.dept}, 
          ${course.deptnum}, ${course.department}, ${course.gereqs}, ${course.groupid}, 
          ${course.grouptype}, ${course.halfcredit}, ${course.level}, ${course.name}, 
          ${course.notes}, ${course.number}, ${course.pf}, ${course.places}, 
          ${course.profs}, ${course.section}, ${course.semester}, ${course.term},
          ${course.title}, ${course.type}, ${course.year}, ${course.sourcePath},
          ${course.words}, ${course.profWords}
        )
      `
    }
  })
}

await migrate()

/**
 * @param {Object} area - area of study
 * @returns {Promise<void>} - resolves when area is inserted
 */
export async function insertArea(area) {
  await db.transaction(async (tx) => {
    await tx.sql`
      INSERT INTO areas (id, data) 
      VALUES (${area.id}, ${JSON.stringify(area)})
    `
  })
}

export async function listAreas() {
  return db.transaction(async (tx) => {
    const result = await tx.sql`
      SELECT id, data
      FROM areas
    `
    return result.rows.map((row) => ({
      id: row.id,
      ...JSON.parse(row.data),
    }))
  })
}

export async function removeArea(id) {
  await removeAreas([id])
}

export async function removeAreas(ids) {
  await db.transaction(async (tx) => {
    await tx.exec(
      `DELETE FROM areas WHERE id IN (${ids.map((id) => `'${id}'`).join(", ")})`,
    await tx.sql`
      DELETE FROM areas WHERE id IN (${ids})
    `
  })
}

export async function removeCourse(clbid) {
  await removeCourses([clbid])
}

export async function removeCourses(clbids) {
  await db.transaction(async (tx) => {
    await tx.exec(
      `DELETE FROM courses WHERE clbid IN (${clbids.map((id) => `'${id}'`).join(", ")})`,
    )
  })
}

/**
 * @param {string} path - course path
 * @returns {Promise<Object>} - resolves to an object mapping clbid to null for prior courses
 **/
export async function getPriorCourses(path) {
  return db.transaction(async (tx) => {
    const result = await tx.sql`
      SELECT clbid FROM courses WHERE sourcePath = ${path}
    `
    return Object.fromEntries(result.rows.map((row) => [row.clbid, null]))
  })
}

/**
 * @param {string} path - area path
 * @returns {Promise<Object>} - resolves to an object mapping clbid to null for prior courses
 **/
export async function getPriorAreas(path) {
  return db.transaction(async (tx) => {
    const result = await tx.sql`
      SELECT id FROM areas WHERE data->>'sourcePath' = ${path}
    `
    return Object.fromEntries(result.rows.map((row) => [row.id, null]))
  })
}

/**
 * @param {string} path - course path
 * @returns {Promise<Object>} - resolves to an object mapping clbid to null for prior courses
 **/
export async function cleanPriorCourses(path) {
  return db.transaction(async (tx) => {
    await tx.sql`DELETE FROM courses WHERE sourcePath = ${path}`
  })
}

/**
 * @param {string} path - area path
 * @returns {Promise<Object>} - resolves to an object mapping clbid to null for prior courses
 **/
export async function cleanPriorAreas(path) {
  return db.transaction(async (tx) => {
    await tx.sql`DELETE FROM areas WHERE data->>'sourcePath' = ${path}`
  })
}

export async function cleanCourseCache(path) {
  return db.transaction(async (tx) => {
    await tx.sql`DELETE FROM courseCache WHERE id = ${path}`
  })
}

export async function cleanAreaCache(path) {
  return db.transaction(async (tx) => {
    await tx.sql`DELETE FROM areaCache WHERE id = ${path}`
  })
}

/**
 * @param {InfoFileTypeEnum} type -
 * @returns {identifier} -
 */
function getCacheStoreName(type) {
  if (type === "courses") {
    return identifier`courseCache`
  } else if (type === "areas") {
    return identifier`areaCache`
  } else {
    console.warn(`"${type}" is not a valid store type`)
    throw new TypeError(`"${type}" is not a valid store type`)
  }
}

/**
 * @param {InfoFileTypeEnum} type - type of file, either "courses" or "areas"
 * @param {string} path - path of the file
 * @param {string} hash - hash of the file
 * @returns {Promise<boolean>} - resolves to true if the cache needs to be updated, false otherwise
 */
export async function cacheNeedsUpdate(type, path, hash) {
  return db.transaction(async (tx) => {
    const result = await tx.sql`
      SELECT hash FROM ${getCacheStoreName(type)} WHERE id = ${path}
    `
    if (result.rows.length === 0) {
      return true
    }
    return result.rows[0].hash !== hash
  })
}

/**
 * @param {string} path - path of the file
 * @param {InfoFileTypeEnum} type - type of file, either "courses" or "areas"
 * @param {string} hash - hash of the file
 * @returns {Promise<void>} - resolves when the cache item is updated
 */
export async function cacheItemHash(path, type, hash) {
  console.log(`caching ${path}`)
  return db.transaction(async (tx) => {
    await tx.sql`
      INSERT INTO ${getCacheStoreName(type)} (id, hash)
      VALUES (${path}, ${hash})
      ON CONFLICT (id) DO UPDATE SET hash = ${hash}
    `
  })
}
