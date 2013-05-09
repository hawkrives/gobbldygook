#ifndef __Data_department__
#define __Data_department__

#include "data-general.hpp"
using namespace std;

class Department {
private:
	dept_t id;
	dept_t intToDept(int i) {
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
	dept_t stringToDept(string str) {
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
	dept_t shortStringToDept(string str) {
		     if ( str == "AS" ) return ASIAN;
		else if ( str == "BI" ) return BIO;
		else if ( str == "CH" ) return CHEM;
		else if ( str == "ES" ) return ENVST;
		else if ( str == "HI" ) return HIST;
		else if ( str == "RE" ) return REL;
		else return NONE;
	}
	string deptToString(dept_t dept) {
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
public:
	Department() {
		id = NONE;
	}
	Department(int i) {
		id = intToDept(i);
	}
	Department(dept_t department) {
		id = department;
	}
	Department(string str) {
		if (str.length() == 2)
			id = shortStringToDept(str);
		else
			id = stringToDept(str);
	}

	dept_t getID() {
		return id;
	}
	string getName() {
		return deptToString(id);
	}
};

#endif
