#include "department.hpp"

//////////////
/////////////
// Constructors
///////////
//////////

Department::Department() {
	// cout << "Called Department constructor with nothing." << endl;
	id = dept_t::NONE;
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
//	cout << "Called Department constructor with string '" << str << "'" << endl;
	// make sure the string is uppercase
	std::transform(str.begin(), str.end(), str.begin(), ::toupper);
	
	// Remove extraneous spaces
	if (str.at(0) == ' ')
		str.erase(0, 1);
	if (str.at(str.length()-1) == ' ')
		str = str.substr(0, str.length()-1);

//	cout << "Called Department constructor with string '" << str << "'" << endl;
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
	     if ( i == 0  ) return dept_t::AFAM;
	else if ( i == 1  ) return dept_t::ALSO;
	else if ( i == 2  ) return dept_t::AMCON;
	else if ( i == 3  ) return dept_t::AMST;
	else if ( i == 4  ) return dept_t::ARMS;
	else if ( i == 5  ) return dept_t::ART;
	else if ( i == 6  ) return dept_t::ASIAN;
	else if ( i == 7  ) return dept_t::BIO;
	else if ( i == 8  ) return dept_t::BMOLS;
	else if ( i == 9  ) return dept_t::CHEM;
	else if ( i == 10 ) return dept_t::CHIN;
	else if ( i == 11 ) return dept_t::CLASS;
	else if ( i == 12 ) return dept_t::CSCI;
	else if ( i == 13 ) return dept_t::DANCE;
	else if ( i == 14 ) return dept_t::ECON;
	else if ( i == 15 ) return dept_t::EDUC;
	else if ( i == 16 ) return dept_t::ENGL;
	else if ( i == 17 ) return dept_t::ENVST;
	else if ( i == 18 ) return dept_t::ESAC;
	else if ( i == 19 ) return dept_t::ESTH;
	else if ( i == 20 ) return dept_t::FAMST;
	else if ( i == 21 ) return dept_t::FILM;
	else if ( i == 22 ) return dept_t::FREN;
	else if ( i == 23 ) return dept_t::GCON;
	else if ( i == 24 ) return dept_t::GERM;
	else if ( i == 25 ) return dept_t::GREEK;
	else if ( i == 26 ) return dept_t::HIST;
	else if ( i == 27 ) return dept_t::HSPST;
	else if ( i == 28 ) return dept_t::IDFA;
	else if ( i == 29 ) return dept_t::INTD;
	else if ( i == 30 ) return dept_t::INTER;
	else if ( i == 31 ) return dept_t::IS;
	else if ( i == 32 ) return dept_t::JAPAN;
	else if ( i == 33 ) return dept_t::LATIN;
	else if ( i == 34 ) return dept_t::MATH;
	else if ( i == 35 ) return dept_t::MEDIA;
	else if ( i == 36 ) return dept_t::MEDVL;
	else if ( i == 37 ) return dept_t::MGMT;
	else if ( i == 38 ) return dept_t::MUSIC;
	else if ( i == 39 ) return dept_t::MUSPF;
	else if ( i == 40 ) return dept_t::NEURO;
	else if ( i == 41 ) return dept_t::NORW;
	else if ( i == 42 ) return dept_t::NURS;
	else if ( i == 43 ) return dept_t::PHIL;
	else if ( i == 44 ) return dept_t::PHYS;
	else if ( i == 45 ) return dept_t::PSCI;
	else if ( i == 46 ) return dept_t::PSYCH;
	else if ( i == 47 ) return dept_t::REL;
	else if ( i == 48 ) return dept_t::RUSSN;
	else if ( i == 49 ) return dept_t::SCICN;
	else if ( i == 50 ) return dept_t::SOAN;
	else if ( i == 51 ) return dept_t::SPAN;
	else if ( i == 52 ) return dept_t::STAT;
	else if ( i == 53 ) return dept_t::SWRK;
	else if ( i == 54 ) return dept_t::THEAT;
	else if ( i == 55 ) return dept_t::WMGST;
	else if ( i == 56 ) return dept_t::WRIT;
	else return dept_t::NONE;
}
dept_t Department::stringToDept(string str) {
	     if ( str == "AFAM"  ) return dept_t::AFAM;
	else if ( str == "ALSO"  ) return dept_t::ALSO;
	else if ( str == "AMCON" ) return dept_t::AMCON;
	else if ( str == "AMST"  ) return dept_t::AMST;
	else if ( str == "ARMS"  ) return dept_t::ARMS;
	else if ( str == "ART"   ) return dept_t::ART;
	else if ( str == "ASIAN" ) return dept_t::ASIAN;
	else if ( str == "BIO"   ) return dept_t::BIO;
	else if ( str == "BMOLS" ) return dept_t::BMOLS;
	else if ( str == "CHEM"  ) return dept_t::CHEM;
	else if ( str == "CHIN"  ) return dept_t::CHIN;
	else if ( str == "CLASS" ) return dept_t::CLASS;
	else if ( str == "CSCI"  ) return dept_t::CSCI;
	else if ( str == "DANCE" ) return dept_t::DANCE;
	else if ( str == "ECON"  ) return dept_t::ECON;
	else if ( str == "EDUC"  ) return dept_t::EDUC;
	else if ( str == "ENGL"  ) return dept_t::ENGL;
	else if ( str == "ENVST" ) return dept_t::ENVST;
	else if ( str == "ESAC"  ) return dept_t::ESAC;
	else if ( str == "ESTH"  ) return dept_t::ESTH;
	else if ( str == "FAMST" ) return dept_t::FAMST;
	else if ( str == "FILM"  ) return dept_t::FILM;
	else if ( str == "FREN"  ) return dept_t::FREN;
	else if ( str == "GCON"  ) return dept_t::GCON;
	else if ( str == "GERM"  ) return dept_t::GERM;
	else if ( str == "GREEK" ) return dept_t::GREEK;
	else if ( str == "HIST"  ) return dept_t::HIST;
	else if ( str == "HSPST" ) return dept_t::HSPST;
	else if ( str == "IDFA"  ) return dept_t::IDFA;
	else if ( str == "INTD"  ) return dept_t::INTD;
	else if ( str == "ID"    ) return dept_t::INTER;
	else if ( str == "IS"    ) return dept_t::IS;
	else if ( str == "JAPAN" ) return dept_t::JAPAN;
	else if ( str == "LATIN" ) return dept_t::LATIN;
	else if ( str == "MATH"  ) return dept_t::MATH;
	else if ( str == "MEDIA" ) return dept_t::MEDIA;
	else if ( str == "MEDVL" ) return dept_t::MEDVL;
	else if ( str == "MGMT"  ) return dept_t::MGMT;
	else if ( str == "MUSIC" ) return dept_t::MUSIC;
	else if ( str == "MUSPF" ) return dept_t::MUSPF;
	else if ( str == "NEURO" ) return dept_t::NEURO;
	else if ( str == "NORW"  ) return dept_t::NORW;
	else if ( str == "NURS"  ) return dept_t::NURS;
	else if ( str == "PHIL"  ) return dept_t::PHIL;
	else if ( str == "PHYS"  ) return dept_t::PHYS;
	else if ( str == "PSCI"  ) return dept_t::PSCI;
	else if ( str == "PSYCH" ) return dept_t::PSYCH;
	else if ( str == "REL"   ) return dept_t::REL;
	else if ( str == "RUSSN" ) return dept_t::RUSSN;
	else if ( str == "RUSST" ) return dept_t::RUSSN;
	else if ( str == "SCICN" ) return dept_t::SCICN;
	else if ( str == "SOAN"  ) return dept_t::SOAN;
	else if ( str == "SPAN"  ) return dept_t::SPAN;
	else if ( str == "STAT"  ) return dept_t::STAT;
	else if ( str == "SWRK"  ) return dept_t::SWRK;
	else if ( str == "THEAT" ) return dept_t::THEAT;
	else if ( str == "WMGST" ) return dept_t::WMGST;
	else if ( str == "WMNST" ) return dept_t::WMGST;
	else if ( str == "WRIT"  ) return dept_t::WRIT;
	else return dept_t::NONE;
}
dept_t Department::shortStringToDept(string str) {
	     if ( str == "AR" ) return dept_t::ART;
	else if ( str == "AS" ) return dept_t::ASIAN;
	else if ( str == "BI" ) return dept_t::BIO;
	else if ( str == "CH" ) return dept_t::CHEM;
	else if ( str == "ES" ) return dept_t::ENVST;
	else if ( str == "HI" ) return dept_t::HIST;
	else if ( str == "IS" ) return dept_t::IS;
	else if ( str == "ID" ) return dept_t::INTER;
	else if ( str == "RE" ) return dept_t::REL;
	else if ( str == "PH" ) return dept_t::PHIL;
	else return dept_t::NONE;
}
dept_t Department::longStringToDept(string str) {
	// cout << "Called longStringToDept with string '" << str << "'" << endl;
	     if ( str == "AFRICA AND THE AMERICAS"                   ) return dept_t::ALSO;
	else if ( str == "ALTERNATE LANGUAGE STUDY OPTION"           ) return dept_t::ALSO;
	else if ( str == "AMERICAN CONVERSATION"                     ) return dept_t::AMCON;
	else if ( str == "AMERICAN STUDIES"                          ) return dept_t::AMST;
	else if ( str == "AMERICAN RACIAL AND MULTICULTURAL STUDIES" ) return dept_t::ARMS;
	else if ( str == "ART AND ART HISTORY"                       ) return dept_t::ART;
	else if ( str == "ASIAN STUDIES"                             ) return dept_t::ASIAN;
	else if ( str == "BIOLOGY"                                   ) return dept_t::BIO;
	else if ( str == "BIOMOLECULAR SCIENCE"                      ) return dept_t::BMOLS;
	else if ( str == "CHEMISTRY"                                 ) return dept_t::CHEM;
	else if ( str == "CHINESE"                                   ) return dept_t::CHIN;
	else if ( str == "CLASSICS"                                  ) return dept_t::CLASS;
	else if ( str == "COMPUTER SCIENCE"                          ) return dept_t::CSCI;
	else if ( str == "DANCE"                                     ) return dept_t::DANCE;
	else if ( str == "ECONOMICS"                                 ) return dept_t::ECON;
	else if ( str == "EDUCATION"                                 ) return dept_t::EDUC;
	else if ( str == "ENGLISH"                                   ) return dept_t::ENGL;
	else if ( str == "ENVIRONMENTAL STUDIES"                     ) return dept_t::ENVST;
	else if ( str == "EXERCISE SCIENCE ACTIVITY"                 ) return dept_t::ESAC;
	else if ( str == "EXERCISE SCIENCE THEORY"                   ) return dept_t::ESTH;
	else if ( str == "FAMILY STUDIES"                            ) return dept_t::FAMST;
	else if ( str == "FILM STUDIES"                              ) return dept_t::FILM;
	else if ( str == "FRENCH"                                    ) return dept_t::FREN;
	else if ( str == "GREAT CONVERSATION"                        ) return dept_t::GCON;
	else if ( str == "GERMAN"                                    ) return dept_t::GERM;
	else if ( str == "GREEK"                                     ) return dept_t::GREEK;
	else if ( str == "HISTORY"                                   ) return dept_t::HIST;
	else if ( str == "HISPANIC STUDIES"                          ) return dept_t::HSPST;
	else if ( str == "UNKNOWN (IDFA)"                            ) return dept_t::IDFA;
	else if ( str == "INTERDEPARTMENTAL"                         ) return dept_t::INTD;
	else if ( str == "INTERDISCIPLINARY"                         ) return dept_t::INTER;
	else if ( str == "INTEGRATIVE STUDIES"                       ) return dept_t::IS;
	else if ( str == "JAPANESE"                                  ) return dept_t::JAPAN;
	else if ( str == "LATIN"                                     ) return dept_t::LATIN;
	else if ( str == "MATHEMATICS"                               ) return dept_t::MATH;
	else if ( str == "MEDIA STUDIES"                             ) return dept_t::MEDIA;
	else if ( str == "MEDIEVAL STUDIES"                          ) return dept_t::MEDVL;
	else if ( str == "MANAGEMENT STUDIES"                        ) return dept_t::MGMT;
	else if ( str == "MUSIC"                                     ) return dept_t::MUSIC;
	else if ( str == "MUSIC PERFORMANCE"                         ) return dept_t::MUSPF;
	else if ( str == "NEUROSCIENCE"                              ) return dept_t::NEURO;
	else if ( str == "NORWEGIAN"                                 ) return dept_t::NORW;
	else if ( str == "NURSING"                                   ) return dept_t::NURS;
	else if ( str == "PHILOSPHY"                                 ) return dept_t::PHIL;
	else if ( str == "PHYSICS"                                   ) return dept_t::PHYS;
	else if ( str == "POLITICAL SCIENCE"                         ) return dept_t::PSCI;
	else if ( str == "PSYCHOLOGY"                                ) return dept_t::PSYCH;
	else if ( str == "RELIGION"                                  ) return dept_t::REL;
	// todo: this should be russt
	else if ( str == "RUSSIAN STUDIES"                           ) return dept_t::RUSSN;
	else if ( str == "RUSSIAN"                                   ) return dept_t::RUSSN;
	else if ( str == "SCIENCE CONVERSATION"                      ) return dept_t::SCICN;
	else if ( str == "SOCIOLOGY AND ANTHROPOLOGY"                ) return dept_t::SOAN;
	else if ( str == "SPANISH"                                   ) return dept_t::SPAN;
	else if ( str == "STATISTICS"                                ) return dept_t::STAT;
	else if ( str == "SOCIAL WORK"                               ) return dept_t::SWRK;
	else if ( str == "THEATER"                                   ) return dept_t::THEAT;
	else if ( str == "WOMEN'S STUDIES"                           ) return dept_t::WMGST;
	else if ( str == "WOMEN'S & GENDER STUDIES"                  ) return dept_t::WMGST;
	else if ( str == "WRITING"                                   ) return dept_t::WRIT;
	else return dept_t::NONE;
}
string Department::deptToString(dept_t dept) {
	     if ( dept == dept_t::AFAM  ) return "AFAM";
	else if ( dept == dept_t::ALSO  ) return "ALSO";
	else if ( dept == dept_t::AMCON ) return "AMCON";
	else if ( dept == dept_t::AMST  ) return "AMST";
	else if ( dept == dept_t::ARMS  ) return "ARMS";
	else if ( dept == dept_t::ART   ) return "ART";
	else if ( dept == dept_t::ASIAN ) return "ASIAN";
	else if ( dept == dept_t::BIO   ) return "BIO";
	else if ( dept == dept_t::BMOLS ) return "BMOLS";
	else if ( dept == dept_t::CHEM  ) return "CHEM";
	else if ( dept == dept_t::CHIN  ) return "CHIN";
	else if ( dept == dept_t::CLASS ) return "CLASS";
	else if ( dept == dept_t::CSCI  ) return "CSCI";
	else if ( dept == dept_t::DANCE ) return "DANCE";
	else if ( dept == dept_t::ECON  ) return "ECON";
	else if ( dept == dept_t::EDUC  ) return "EDUC";
	else if ( dept == dept_t::ENGL  ) return "ENGL";
	else if ( dept == dept_t::ENVST ) return "ENVST";
	else if ( dept == dept_t::ESAC  ) return "ESAC";
	else if ( dept == dept_t::ESTH  ) return "ESTH";
	else if ( dept == dept_t::FAMST ) return "FAMST";
	else if ( dept == dept_t::FILM  ) return "FILM";
	else if ( dept == dept_t::FREN  ) return "FREN";
	else if ( dept == dept_t::GCON  ) return "GCON";
	else if ( dept == dept_t::GERM  ) return "GERM";
	else if ( dept == dept_t::GREEK ) return "GREEK";
	else if ( dept == dept_t::HIST  ) return "HIST";
	else if ( dept == dept_t::HSPST ) return "HSPST";
	else if ( dept == dept_t::IDFA  ) return "IDFA";
	else if ( dept == dept_t::INTD  ) return "INTD";
	else if ( dept == dept_t::INTER ) return "ID";
	else if ( dept == dept_t::IS    ) return "IS";
	else if ( dept == dept_t::JAPAN ) return "JAPAN";
	else if ( dept == dept_t::LATIN ) return "LATIN";
	else if ( dept == dept_t::MATH  ) return "MATH";
	else if ( dept == dept_t::MEDIA ) return "MEDIA";
	else if ( dept == dept_t::MEDVL ) return "MEDVL";
	else if ( dept == dept_t::MGMT  ) return "MGMT";
	else if ( dept == dept_t::MUSIC ) return "MUSIC";
	else if ( dept == dept_t::MUSPF ) return "MUSPF";
	else if ( dept == dept_t::NEURO ) return "NEURO";
	else if ( dept == dept_t::NORW  ) return "NORW";
	else if ( dept == dept_t::NURS  ) return "NURS";
	else if ( dept == dept_t::PHIL  ) return "PHIL";
	else if ( dept == dept_t::PHYS  ) return "PHYS";
	else if ( dept == dept_t::PSCI  ) return "PSCI";
	else if ( dept == dept_t::PSYCH ) return "PSYCH";
	else if ( dept == dept_t::REL   ) return "REL";
	else if ( dept == dept_t::RUSSN ) return "RUSSN";
	else if ( dept == dept_t::SCICN ) return "SCICN";
	else if ( dept == dept_t::SOAN  ) return "SOAN";
	else if ( dept == dept_t::SPAN  ) return "SPAN";
	else if ( dept == dept_t::STAT  ) return "STAT";
	else if ( dept == dept_t::SWRK  ) return "SWRK";
	else if ( dept == dept_t::THEAT ) return "THEAT";
	else if ( dept == dept_t::WMGST ) return "WMGST";
	else if ( dept == dept_t::WRIT  ) return "WRIT";
	else return "NONE";
}
string Department::deptToLongName(dept_t dept) {
	     if ( dept == dept_t::ALSO  ) return "Africa and the Americas";
	else if ( dept == dept_t::ALSO  ) return "Alternate Language Study Option";
	else if ( dept == dept_t::AMCON ) return "American Conversation";
	else if ( dept == dept_t::AMST  ) return "American Studies";
	else if ( dept == dept_t::ARMS  ) return "American Racial and Multicultural Studies";
	else if ( dept == dept_t::ART   ) return "Art and Art History";
	else if ( dept == dept_t::ASIAN ) return "Asian Studies";
	else if ( dept == dept_t::BIO   ) return "Biology";
	else if ( dept == dept_t::BMOLS ) return "Biomolecular Science";
	else if ( dept == dept_t::CHEM  ) return "Chemistry";
	else if ( dept == dept_t::CHIN  ) return "Chinese";
	else if ( dept == dept_t::CLASS ) return "Classics";
	else if ( dept == dept_t::CSCI  ) return "Computer Science";
	else if ( dept == dept_t::DANCE ) return "Dance";
	else if ( dept == dept_t::ECON  ) return "Economics";
	else if ( dept == dept_t::EDUC  ) return "Education";
	else if ( dept == dept_t::ENGL  ) return "English";
	else if ( dept == dept_t::ENVST ) return "Environmental Studies";
	else if ( dept == dept_t::ESAC  ) return "Exercise Science Activity";
	else if ( dept == dept_t::ESTH  ) return "Exercise Science Theory";
	else if ( dept == dept_t::FAMST ) return "Family Studies";
	else if ( dept == dept_t::FILM  ) return "Film Studies";
	else if ( dept == dept_t::FREN  ) return "French";
	else if ( dept == dept_t::GCON  ) return "Great Conversation";
	else if ( dept == dept_t::GERM  ) return "German";
	else if ( dept == dept_t::GREEK ) return "Greek";
	else if ( dept == dept_t::HIST  ) return "History";
	else if ( dept == dept_t::HSPST ) return "Hispanic Studies";
	else if ( dept == dept_t::IDFA  ) return "Unknown (IDFA)";
	else if ( dept == dept_t::INTD  ) return "Interdepartmental";
	else if ( dept == dept_t::INTER ) return "Interdisciplinary";
	else if ( dept == dept_t::IS    ) return "Integrative Studies";
	else if ( dept == dept_t::JAPAN ) return "Japanese";
	else if ( dept == dept_t::LATIN ) return "Latin";
	else if ( dept == dept_t::MATH  ) return "Mathematics";
	else if ( dept == dept_t::MEDIA ) return "Media Studies";
	else if ( dept == dept_t::MEDVL ) return "Medieval Studies";
	else if ( dept == dept_t::MGMT  ) return "Management Studies";
	else if ( dept == dept_t::MUSIC ) return "Music";
	else if ( dept == dept_t::MUSPF ) return "Music Performance";
	else if ( dept == dept_t::NEURO ) return "Neuroscience";
	else if ( dept == dept_t::NORW  ) return "Norwegian";
	else if ( dept == dept_t::NURS  ) return "Nursing";
	else if ( dept == dept_t::PHIL  ) return "Philosphy";
	else if ( dept == dept_t::PHYS  ) return "Physics";
	else if ( dept == dept_t::PSCI  ) return "Political Science";
	else if ( dept == dept_t::PSYCH ) return "Psychology";
	else if ( dept == dept_t::REL   ) return "Religion";
	else if ( dept == dept_t::RUSSN ) return "Russian";
	else if ( dept == dept_t::SCICN ) return "Science Conversation";
	else if ( dept == dept_t::SOAN  ) return "Sociology and Anthropology";
	else if ( dept == dept_t::SPAN  ) return "Spanish";
	else if ( dept == dept_t::STAT  ) return "Statistics";
	else if ( dept == dept_t::SWRK  ) return "Social Work";
	else if ( dept == dept_t::THEAT ) return "Theater";
	else if ( dept == dept_t::WMGST ) return "Women's & Gender Studies";
	else if ( dept == dept_t::WRIT  ) return "Writing";
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

bool operator== (const Department &d1, const Department &d2) {
    return (d1.id == d2.id);
}

bool operator!= (Department &d1, Department &d2) {
    return !(d1 == d2);
}

bool operator< (const Department &d1, const Department &d2) {
	return (d1.id < d2.id);
}
