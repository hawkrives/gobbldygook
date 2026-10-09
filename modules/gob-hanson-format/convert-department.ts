import forEach from "lodash/forEach"
const shortDepartmentAbbreviationsToFullDepartmentAbbreviations: Readonly<
  Record<string, string>
> = {
  AR: "ART",
  AS: "ASIAN",
  BI: "BIO",
  CH: "CHEM",
  CS: "CSCI",
  EC: "ECON",
  EN: "ENGL",
  ES: "ENVST",
  HI: "HIST",
  LI: "LING",
  MU: "MUSIC",
  PH: "PHIL",
  PS: "PSCI",
  RE: "REL",
  SA: "SOAN",
}
const fullDepartmentNamesToFullDepartmentAbbreviations: Readonly<
  Record<string, string>
> = {
  "AFRICA AND THE AMERICAS": "AFAM",
  "ALTERNATE LANGUAGE STUDY OPTION": "ALSO",
  "AMERICAN CON": "AMCON",
  "AMERICAN CONVERSATION": "AMCON",
  "AMERICAN CONVERSATIONS": "AMCON",
  "AMERICAN RACIAL AND MULTICULTURAL STUDIES": "ARMS",
  "AMERICAN STUDIES": "AMST",
  "ART AND ART HISTORY": "ART",
  "ASIAN STUDIES": "ASIAN",
  BIOLOGY: "BIO",
  "BIOMEDICAL STUDIES": "BMED",
  "BIOMOLECULAR SCIENCE": "BMOLS",
  "BIOMOLECULAR STUDIES": "BMOLS",
  BMOL: "BMOLS",
  CHEMISTRY: "CHEM",
  CHINESE: "CHIN",
  CLASSICS: "CLASS",
  COMPSCI: "CSCI",
  "COMPUTER SCIENCE": "CSCI",
  DANCE: "DANCE",
  ECONOMICS: "ECON",
  EDUCATION: "EDUC",
  ENGLISH: "ENGL",
  "ENVIRONMENTAL STUDIES": "ENVST",
  "EXERCISE SCIENCE ACTIVITY": "ESAC",
  "EXERCISE SCIENCE THEORY": "ESTH",
  "FAMILY STUDIES": "FAMST",
  "FILM STUDIES": "FILM",
  FRENCH: "FREN",
  "GENDER STUDIES": "WMGST",
  GERMAN: "GERM",
  GRCON: "GCON",
  "GREAT CON": "GCON",
  "GREAT CONVERSATION": "GCON",
  "GREAT CONVERSATIONS": "GCON",
  GREATCON: "GCON",
  GREEK: "GREEK",
  "HISPANIC STUDIES": "HSPST",
  HISTORY: "HIST",
  "INTEGRATIVE STUDIES": "IS",
  INTERDEPARTMENTAL: "INTD",
  "INTERDISCIPLINARY FINE ARTS": "IDFA",
  INTERDISCIPLINARY: "ID",
  JAPANESE: "JAPAN",
  LATIN: "LATIN",
  "MANAGEMENT STUDIES": "MGMT",
  "MATH/STAT/CSCI": "MSCS",
  MATHEMATICS: "MATH",
  "MEDIA STUDIES": "MEDIA",
  "MEDIEVAL STUDIES": "MEDVL",
  "MUSIC PERFORMANCE": "MUSPF",
  MUSIC: "MUSIC",
  NEUROSCIENCE: "NEURO",
  NORWEGIAN: "NORW",
  NURSING: "NURS",
  PHILOSPHY: "PHIL",
  PHYSICS: "PHYS",
  "POLITICAL SCIENCE": "PSCI",
  PSYCHOLOGY: "PSYCH",
  RELIGION: "REL",
  "RUSSIAN STUDIES": "RUSSN",
  "SCIENCE CONVERSATION": "SCICN",
  "SOCIAL WORK": "SWRK",
  "SOCIOLOGY AND ANTHROPOLOGY": "SOAN",
  SPANISH: "SPAN",
  STATISTICS: "STAT",
  THEATER: "THEAT",
  "UNKNOWN DEPARTMENT": "NONE",
  "WOMEN'S AND GENDER STUDIES": "WMGST",
  "WOMEN'S STUDIES": "WMGST",
  "WOMENS AND GENDER STUDIES": "WMGST",
  "WOMENS STUDIES": "WMGST",
  WRI: "WRIT",
  WRITING: "WRIT",
}
const departmentAbbreviationsToNames: Record<string, string> = {
  AFAM: "Africa and the Americas",
  ALSO: "Alternate Language Study Option",
  AMCON: "American Conversation",
  AMST: "American Studies",
  ARMS: "American Racial and Multicultural Studies",
  ART: "Art and Art History",
  ASIAN: "Asian Studies",
  BIO: "Biology",
  BMED: "Biomedical Studies",
  BMOLS: "Biomolecular Science",
  BMOL: "Biomolecular Science",
  CHEM: "Chemistry",
  CHIN: "Chinese",
  CLASS: "Classics",
  CSCI: "Computer Science",
  DANCE: "Dance",
  ECON: "Economics",
  EDUC: "Education",
  ENGL: "English",
  ENVST: "Environmental Studies",
  ESAC: "Exercise Science Activity",
  ESTH: "Exercise Science Theory",
  FAMST: "Family Studies",
  FILM: "Film Studies",
  FREN: "French",
  GCON: "Great Conversation",
  GERM: "German",
  GREEK: "Greek",
  HIST: "History",
  HSPST: "Hispanic Studies",
  ID: "Interdisciplinary",
  IDFA: "Interdisciplinary Fine Arts",
  INTD: "Interdepartmental",
  IS: "Integrative Studies",
  JAPAN: "Japanese",
  LATIN: "Latin",
  MATH: "Mathematics",
  MEDIA: "Media Studies",
  MEDVL: "Medieval Studies",
  MGMT: "Management Studies",
  MUSIC: "Music",
  MUSPF: "Music Performance",
  MSCS: "Math/Stat/CSci",
  NEURO: "Neuroscience",
  NORW: "Norwegian",
  NURS: "Nursing",
  PHIL: "Philosphy",
  PHYS: "Physics",
  PSCI: "Political Science",
  PSYCH: "Psychology",
  REL: "Religion",
  RUSST: "Russian Studies",
  RUSSN: "Russian Studies",
  SCICN: "Science Conversation",
  SOAN: "Sociology and Anthropology",
  SPAN: "Spanish",
  STAT: "Statistics",
  SWRK: "Social Work",
  THEAT: "Theater",
  WMNST: "Women's Studies",
  WMGST: "Women's and Gender Studies",
  WRIT: "Writing",
  NONE: "Unknown Department",
}
// add the shorter mappings from shortDepartmentAbbreviationsToFullDepartmentAbbreviations
forEach(
  shortDepartmentAbbreviationsToFullDepartmentAbbreviations,
  (val, key) => {
    // given the 'es' => 'envst' mapping, add a 'es' => departmentAbbreviationsToNames['envst']
    // mapping
    const name = departmentAbbreviationsToNames[val]
    if (name !== undefined) {
      departmentAbbreviationsToNames[key] = name
    }
  },
)
const toDepartmentAbbreviations: Readonly<Record<string, string>> = {
  ...shortDepartmentAbbreviationsToFullDepartmentAbbreviations,
  ...fullDepartmentNamesToFullDepartmentAbbreviations,
}
const toDepartmentNames: Readonly<Record<string, string>> = {
  ...departmentAbbreviationsToNames,
}

// Looks a key up in a plain lookup table, ignoring inherited properties.
function lookup(
  table: Readonly<Record<string, string>>,
  key: string,
): string | undefined {
  return Object.hasOwn(table, key) ? table[key] : undefined
}

export function expandDepartment(dept: string): string {
  dept = dept.toUpperCase()

  const name = lookup(toDepartmentNames, dept)
  if (name === undefined) {
    throw new TypeError(
      `expandDepartment(): '${dept}' is not a valid department shorthand`,
    )
  }

  return name
}

export function normalizeDepartment(dept: string): string {
  dept = dept.toUpperCase()

  return lookup(toDepartmentAbbreviations, dept) ?? dept
}
