import orange from "orange-orm"

// TODO: migrations?
// ...
// oh, I see. You actually create your database schema on your own,
// then you just tell orange what the schema looks like, here.

const map = orange.map((x) => ({
  areas: x.table("areas").map(({ column }) => ({
    id: column("id").string().primary().notNullExceptInsert(),
    data: column("data").json(),
  })),

  areaCache: x.table("areaCache").map(({ column }) => ({
    id: column("id").string().primary().notNullExceptInsert(),
    data: column("data").json(),
  })),

  courseCache: x.table("courseCache").map(({ column }) => ({
    id: column("id").string().primary().notNullExceptInsert(),
    data: column("data").json(),
  })),

  courses: x.table("courses").map(({ column }) => ({
    clbid: column("clbid").string().primary().notNullExceptInsert(),
    crsid: column("crsid").string(),
    credits: column("credits").numeric(),
    dept: column("dept").string(),
    deptnum: column("deptnum").string(),
    department: column("department").string(),
    gereqs: column("gereqs").string().array(),
    groupid: column("groupid").string(),
    grouptype: column("grouptype").string(),
    halfcredit: column("halfcredit").boolean(),
    level: column("level").string(),
    name: column("name").string(),
    notes: column("notes").string(),
    number: column("number").string().array(),
    pf: column("pf").boolean(),
    places: column("places").string().array(),
    profs: column("profs").string().array(),
    section: column("section").string(),
    semester: column("semester").string(),
    term: column("term").string(),
    title: column("title").string(),
    type: column("type").string(),
    year: column("year").numeric(),
    sourcePath: column("sourcePath").string(),
    words: column("words").string().array(),
    profWords: column("profWords").string().array(),
  })),
}))

export default map
