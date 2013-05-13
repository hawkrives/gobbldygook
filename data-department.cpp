#include "data-department.hpp"
using namespace std;

//////////////
/////////////
// Constructors
///////////
//////////

Department::Department() {
	// cout << "Called Department constructor with nothing." << endl;
	id = NONE;
}

Department::Department(int i) {
	cout << "Called Department constructor with integer." << endl;
	id = intToDept(i);
}

Department::Department(dept_t department) {
//	cout << "Called Department constructor with dept_t." << endl;
	id = department;
}

Department::Department(string str) {
	cout << "Called Department constructor with string '" << str << "'" << endl;
	// make sure the string is uppercase
	std::transform(str.begin(), str.end(), str.begin(), ::toupper);
	if (str.length() > 5)
		id = longStringToDept(str);
	else if (str.length() == 2)
		id = shortStringToDept(str);
	else
		id = stringToDept(str);
	// cout << ", which ended up as '" << str << "'" << endl;
}

Department::Department(const Department &c) {
	// cout << "Used the Department copy constructor." << endl;
	copy(c);
}

Department& Department::operator= (const Department &c) {
	// cout << "Used the Department = override." << endl;
	if (this == &c) return *this;
	copy(c);
	return *this;
}


//////////////
/////////////
// Constructor helper methods
///////////
//////////

void Department::copy(const Department& c) {
	id = c.id;
}

dept_t Department::intToDept(int i) {
	     if ( i == 0  ) return AFAM;
	else if ( i == 1  ) return ALSO;
	else if ( i == 2  ) return AMCON;
	else if ( i == 3  ) return AMST;
	else if ( i == 4  ) return ARMS;
	else if ( i == 5  ) return ART;
	else if ( i == 6  ) return ASIAN;
	else if ( i == 7  ) return BIO;
	else if ( i == 8  ) return BMOLS;
	else if ( i == 9  ) return CHEM;
	else if ( i == 10 ) return CHIN;
	else if ( i == 11 ) return CLASS;
	else if ( i == 12 ) return CSCI;
	else if ( i == 13 ) return DANCE;
	else if ( i == 14 ) return ECON;
	else if ( i == 15 ) return EDUC;
	else if ( i == 16 ) return ENGL;
	else if ( i == 17 ) return ENVST;
	else if ( i == 18 ) return ESAC;
	else if ( i == 19 ) return ESTH;
	else if ( i == 20 ) return FAMST;
	else if ( i == 21 ) return FILM;
	else if ( i == 22 ) return FREN;
	else if ( i == 23 ) return GCON;
	else if ( i == 24 ) return GERM;
	else if ( i == 25 ) return GREEK;
	else if ( i == 26 ) return HIST;
	else if ( i == 27 ) return HSPST;
	else if ( i == 28 ) return IDFA;
	else if ( i == 29 ) return INTD;
	else if ( i == 30 ) return INTER;
	else if ( i == 31 ) return IS;
	else if ( i == 32 ) return JAPAN;
	else if ( i == 33 ) return LATIN;
	else if ( i == 34 ) return MATH;
	else if ( i == 35 ) return MEDIA;
	else if ( i == 36 ) return MEDVL;
	else if ( i == 37 ) return MGMT;
	else if ( i == 38 ) return MUSIC;
	else if ( i == 39 ) return MUSPF;
	else if ( i == 40 ) return NEURO;
	else if ( i == 41 ) return NORW;
	else if ( i == 42 ) return NURS;
	else if ( i == 43 ) return PHIL;
	else if ( i == 44 ) return PHYS;
	else if ( i == 45 ) return PSCI;
	else if ( i == 46 ) return PSYCH;
	else if ( i == 47 ) return REL;
	else if ( i == 48 ) return RUSSN;
	else if ( i == 49 ) return SCICN;
	else if ( i == 50 ) return SOAN;
	else if ( i == 51 ) return SPAN;
	else if ( i == 52 ) return STAT;
	else if ( i == 53 ) return SWRK;
	else if ( i == 54 ) return THEAT;
	else if ( i == 55 ) return WMGST;
	else if ( i == 56 ) return WRIT;
	else return NONE;
}
dept_t Department::stringToDept(string str) {
	     if ( str == "AFAM"  ) return AFAM;
	else if ( str == "ALSO"  ) return ALSO;
	else if ( str == "AMCON" ) return AMCON;
	else if ( str == "AMST"  ) return AMST;
	else if ( str == "ARMS"  ) return ARMS;
	else if ( str == "ART"   ) return ART;
	else if ( str == "ASIAN" ) return ASIAN;
	else if ( str == "BIO"   ) return BIO;
	else if ( str == "BMOLS" ) return BMOLS;
	else if ( str == "CHEM"  ) return CHEM;
	else if ( str == "CHIN"  ) return CHIN;
	else if ( str == "CLASS" ) return CLASS;
	else if ( str == "CSCI"  ) return CSCI;
	else if ( str == "DANCE" ) return DANCE;
	else if ( str == "ECON"  ) return ECON;
	else if ( str == "EDUC"  ) return EDUC;
	else if ( str == "ENGL"  ) return ENGL;
	else if ( str == "ENVST" ) return ENVST;
	else if ( str == "ESAC"  ) return ESAC;
	else if ( str == "ESTH"  ) return ESTH;
	else if ( str == "FAMST" ) return FAMST;
	else if ( str == "FILM"  ) return FILM;
	else if ( str == "FREN"  ) return FREN;
	else if ( str == "GCON"  ) return GCON;
	else if ( str == "GERM"  ) return GERM;
	else if ( str == "GREEK" ) return GREEK;
	else if ( str == "HIST"  ) return HIST;
	else if ( str == "HSPST" ) return HSPST;
	else if ( str == "IDFA"  ) return IDFA;
	else if ( str == "INTD"  ) return INTD;
	else if ( str == "ID"    ) return INTER;
	else if ( str == "IS"    ) return IS;
	else if ( str == "JAPAN" ) return JAPAN;
	else if ( str == "LATIN" ) return LATIN;
	else if ( str == "MATH"  ) return MATH;
	else if ( str == "MEDIA" ) return MEDIA;
	else if ( str == "MEDVL" ) return MEDVL;
	else if ( str == "MGMT"  ) return MGMT;
	else if ( str == "MUSIC" ) return MUSIC;
	else if ( str == "MUSPF" ) return MUSPF;
	else if ( str == "NEURO" ) return NEURO;
	else if ( str == "NORW"  ) return NORW;
	else if ( str == "NURS"  ) return NURS;
	else if ( str == "PHIL"  ) return PHIL;
	else if ( str == "PHYS"  ) return PHYS;
	else if ( str == "PSCI"  ) return PSCI;
	else if ( str == "PSYCH" ) return PSYCH;
	else if ( str == "REL"   ) return REL;
	else if ( str == "RUSSN" ) return RUSSN;
	else if ( str == "SCICN" ) return SCICN;
	else if ( str == "SOAN"  ) return SOAN;
	else if ( str == "SPAN"  ) return SPAN;
	else if ( str == "STAT"  ) return STAT;
	else if ( str == "SWRK"  ) return SWRK;
	else if ( str == "THEAT" ) return THEAT;
	else if ( str == "WMGST" ) return WMGST;
	else if ( str == "WRIT"  ) return WRIT;
	else return NONE;
}
dept_t Department::shortStringToDept(string str) {
	     if ( str == "AR" ) return ART;
	else if ( str == "AS" ) return ASIAN;
	else if ( str == "BI" ) return BIO;
	else if ( str == "CH" ) return CHEM;
	else if ( str == "ES" ) return ENVST;
	else if ( str == "HI" ) return HIST;
	else if ( str == "IS" ) return IS;
	else if ( str == "ID" ) return INTER;
	else if ( str == "RE" ) return REL;
	else return NONE;
}
dept_t Department::longStringToDept(string str) {
	// cout << "Called longStringToDept with string '" << str << "'" << endl;
	     if ( str == "AFRICA AND THE AMERICAS"                   ) return ALSO;
	else if ( str == "ALTERNATE LANGUAGE STUDY OPTION"           ) return ALSO;
	else if ( str == "AMERICAN CONVERSATION"                     ) return AMCON;
	else if ( str == "AMERICAN STUDIES"                          ) return AMST;
	else if ( str == "AMERICAN RACIAL AND MULTICULTURAL STUDIES" ) return ARMS;
	else if ( str == "ART AND ART HISTORY"                       ) return ART;
	else if ( str == "ASIAN STUDIES"                             ) return ASIAN;
	else if ( str == "BIOLOGY"                                   ) return BIO;
	else if ( str == "BIOMOLECULAR SCIENCE"                      ) return BMOLS;
	else if ( str == "CHEMISTRY"                                 ) return CHEM;
	else if ( str == "CHINESE"                                   ) return CHIN;
	else if ( str == "CLASSICS"                                  ) return CLASS;
	else if ( str == "COMPUTER SCIENCE"                          ) return CSCI;
	else if ( str == "DANCE"                                     ) return DANCE;
	else if ( str == "ECONOMICS"                                 ) return ECON;
	else if ( str == "EDUCATION"                                 ) return EDUC;
	else if ( str == "ENGLISH"                                   ) return ENGL;
	else if ( str == "ENVIRONMENTAL STUDIES"                     ) return ENVST;
	else if ( str == "EXERCISE SCIENCE ACTIVITY"                 ) return ESAC;
	else if ( str == "EXERCISE SCIENCE THEORY"                   ) return ESTH;
	else if ( str == "FAMILY STUDIES"                            ) return FAMST;
	else if ( str == "FILM STUDIES"                              ) return FILM;
	else if ( str == "FRENCH"                                    ) return FREN;
	else if ( str == "GREAT CONVERSATION"                        ) return GCON;
	else if ( str == "GERMAN"                                    ) return GERM;
	else if ( str == "GREEK"                                     ) return GREEK;
	else if ( str == "HISTORY"                                   ) return HIST;
	else if ( str == "HISPANIC STUDIES"                          ) return HSPST;
	else if ( str == "UNKNOWN (IDFA)"                            ) return IDFA;
	else if ( str == "INTERDEPARTMENTAL"                         ) return INTD;
	else if ( str == "INTERDISCIPLINARY"                         ) return INTER;
	else if ( str == "INTEGRATIVE STUDIES"                       ) return IS;
	else if ( str == "JAPANESE"                                  ) return JAPAN;
	else if ( str == "LATIN"                                     ) return LATIN;
	else if ( str == "MATHEMATICS"                               ) return MATH;
	else if ( str == "MEDIA STUDIES"                             ) return MEDIA;
	else if ( str == "MEDIEVAL STUDIES"                          ) return MEDVL;
	else if ( str == "MANAGEMENT STUDIES"                        ) return MGMT;
	else if ( str == "MUSIC"                                     ) return MUSIC;
	else if ( str == "MUSIC PERFORMANCE"                         ) return MUSPF;
	else if ( str == "NEUROSCIENCE"                              ) return NEURO;
	else if ( str == "NORWEGIAN"                                 ) return NORW;
	else if ( str == "NURSING"                                   ) return NURS;
	else if ( str == "PHILOSPHY"                                 ) return PHIL;
	else if ( str == "PHYSICS"                                   ) return PHYS;
	else if ( str == "POLITICAL SCIENCE"                         ) return PSCI;
	else if ( str == "PSYCHOLOGY"                                ) return PSYCH;
	else if ( str == "RELIGION"                                  ) return REL;
	else if ( str == "RUSSIAN"                                   ) return RUSSN;
	else if ( str == "SCIENCE CONVERSATION"                      ) return SCICN;
	else if ( str == "SOCIOLOGY AND ANTHROPOLOGY"                ) return SOAN;
	else if ( str == "SPANISH"                                   ) return SPAN;
	else if ( str == "STATISTICS"                                ) return STAT;
	else if ( str == "SOCIAL WORK"                               ) return SWRK;
	else if ( str == "THEATER"                                   ) return THEAT;
	else if ( str == "WOMEN'S & GENDER STUDIES"                  ) return WMGST;
	else if ( str == "WRITING"                                   ) return WRIT;
	else return NONE;
}
string Department::deptToString(dept_t dept) {
	     if ( dept == AFAM  ) return "AFAM";
	else if ( dept == ALSO  ) return "ALSO";
	else if ( dept == AMCON ) return "AMCON";
	else if ( dept == AMST  ) return "AMST";
	else if ( dept == ARMS  ) return "ARMS";
	else if ( dept == ART   ) return "ART";
	else if ( dept == ASIAN ) return "ASIAN";
	else if ( dept == BIO   ) return "BIO";
	else if ( dept == BMOLS ) return "BMOLS";
	else if ( dept == CHEM  ) return "CHEM";
	else if ( dept == CHIN  ) return "CHIN";
	else if ( dept == CLASS ) return "CLASS";
	else if ( dept == CSCI  ) return "CSCI";
	else if ( dept == DANCE ) return "DANCE";
	else if ( dept == ECON  ) return "ECON";
	else if ( dept == EDUC  ) return "EDUC";
	else if ( dept == ENGL  ) return "ENGL";
	else if ( dept == ENVST ) return "ENVST";
	else if ( dept == ESAC  ) return "ESAC";
	else if ( dept == ESTH  ) return "ESTH";
	else if ( dept == FAMST ) return "FAMST";
	else if ( dept == FILM  ) return "FILM";
	else if ( dept == FREN  ) return "FREN";
	else if ( dept == GCON  ) return "GCON";
	else if ( dept == GERM  ) return "GERM";
	else if ( dept == GREEK ) return "GREEK";
	else if ( dept == HIST  ) return "HIST";
	else if ( dept == HSPST ) return "HSPST";
	else if ( dept == IDFA  ) return "IDFA";
	else if ( dept == INTD  ) return "INTD";
	else if ( dept == INTER ) return "ID";
	else if ( dept == IS    ) return "IS";
	else if ( dept == JAPAN ) return "JAPAN";
	else if ( dept == LATIN ) return "LATIN";
	else if ( dept == MATH  ) return "MATH";
	else if ( dept == MEDIA ) return "MEDIA";
	else if ( dept == MEDVL ) return "MEDVL";
	else if ( dept == MGMT  ) return "MGMT";
	else if ( dept == MUSIC ) return "MUSIC";
	else if ( dept == MUSPF ) return "MUSPF";
	else if ( dept == NEURO ) return "NEURO";
	else if ( dept == NORW  ) return "NORW";
	else if ( dept == NURS  ) return "NURS";
	else if ( dept == PHIL  ) return "PHIL";
	else if ( dept == PHYS  ) return "PHYS";
	else if ( dept == PSCI  ) return "PSCI";
	else if ( dept == PSYCH ) return "PSYCH";
	else if ( dept == REL   ) return "REL";
	else if ( dept == RUSSN ) return "RUSSN";
	else if ( dept == SCICN ) return "SCICN";
	else if ( dept == SOAN  ) return "SOAN";
	else if ( dept == SPAN  ) return "SPAN";
	else if ( dept == STAT  ) return "STAT";
	else if ( dept == SWRK  ) return "SWRK";
	else if ( dept == THEAT ) return "THEAT";
	else if ( dept == WMGST ) return "WMGST";
	else if ( dept == WRIT  ) return "WRIT";
	else return "NONE";
}
string Department::deptToLongName(dept_t dept) {
	     if ( dept == ALSO  ) return "Africa and the Americas";
	else if ( dept == ALSO  ) return "Alternate Language Study Option";
	else if ( dept == AMCON ) return "American Conversation";
	else if ( dept == AMST  ) return "American Studies";
	else if ( dept == ARMS  ) return "American Racial and Multicultural Studies";
	else if ( dept == ART   ) return "Art and Art History";
	else if ( dept == ASIAN ) return "Asian Studies";
	else if ( dept == BIO   ) return "Biology";
	else if ( dept == BMOLS ) return "Biomolecular Science";
	else if ( dept == CHEM  ) return "Chemistry";
	else if ( dept == CHIN  ) return "Chinese";
	else if ( dept == CLASS ) return "Classics";
	else if ( dept == CSCI  ) return "Computer Science";
	else if ( dept == DANCE ) return "Dance";
	else if ( dept == ECON  ) return "Economics";
	else if ( dept == EDUC  ) return "Education";
	else if ( dept == ENGL  ) return "English";
	else if ( dept == ENVST ) return "Environmental Studies";
	else if ( dept == ESAC  ) return "Exercise Science Activity";
	else if ( dept == ESTH  ) return "Exercise Science Theory";
	else if ( dept == FAMST ) return "Family Studies";
	else if ( dept == FILM  ) return "Film Studies";
	else if ( dept == FREN  ) return "French";
	else if ( dept == GCON  ) return "Great Conversation";
	else if ( dept == GERM  ) return "German";
	else if ( dept == GREEK ) return "Greek";
	else if ( dept == HIST  ) return "History";
	else if ( dept == HSPST ) return "Hispanic Studies";
	else if ( dept == IDFA  ) return "Unknown (IDFA)";
	else if ( dept == INTD  ) return "Interdepartmental";
	else if ( dept == INTER ) return "Interdisciplinary";
	else if ( dept == IS    ) return "Integrative Studies";
	else if ( dept == JAPAN ) return "Japanese";
	else if ( dept == LATIN ) return "Latin";
	else if ( dept == MATH  ) return "Mathematics";
	else if ( dept == MEDIA ) return "Media Studies";
	else if ( dept == MEDVL ) return "Medieval Studies";
	else if ( dept == MGMT  ) return "Management Studies";
	else if ( dept == MUSIC ) return "Music";
	else if ( dept == MUSPF ) return "Music Performance";
	else if ( dept == NEURO ) return "Neuroscience";
	else if ( dept == NORW  ) return "Norwegian";
	else if ( dept == NURS  ) return "Nursing";
	else if ( dept == PHIL  ) return "Philosphy";
	else if ( dept == PHYS  ) return "Physics";
	else if ( dept == PSCI  ) return "Political Science";
	else if ( dept == PSYCH ) return "Psychology";
	else if ( dept == REL   ) return "Religion";
	else if ( dept == RUSSN ) return "Russian";
	else if ( dept == SCICN ) return "Science Conversation";
	else if ( dept == SOAN  ) return "Sociology and Anthropology";
	else if ( dept == SPAN  ) return "Spanish";
	else if ( dept == STAT  ) return "Statistics";
	else if ( dept == SWRK  ) return "Social Work";
	else if ( dept == THEAT ) return "Theater";
	else if ( dept == WMGST ) return "Women's & Gender Studies";
	else if ( dept == WRIT  ) return "Writing";
	else return "Unknown (NONE)";
}


//////////////
/////////////
// Getters
///////////
//////////

dept_t Department::getDept_t() {
	return id;
}
string Department::getName() {
	return deptToString(id);
}
string Department::getFullName() {
	// cout << id << endl;
	return deptToLongName(id);
}


//////////////
/////////////
// Overrides
///////////
//////////

ostream& Department::getData(ostream &os) {
	os << getFullName();
	return os;
}

ostream &operator<<(ostream &os, Department &item) { 
	return item.getData(os); 
}

bool operator== (Department &d1, Department &d2) {
    return (d1.id == d2.id);
}

bool operator!= (Department &d1, Department &d2) {
    return !(d1 == d2);
}
