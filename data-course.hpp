#ifndef __Data_course__
#define __Data_course__

#include "data-general.hpp"
#include "data-major.hpp"
#include "data-department.hpp"
using namespace std;

class Course {
protected:
	string ID;
	int number;
	string title;
	string description;
	char section;
	
	vector<Major> majors;
	Department* department;
	string concentrations;
	string conversations;
	string professor;

	int half_semester;
	bool pass_fail;
	float credits;
	string location;

	bool lab;
	GenEd* geneds;

	bool days[7];
	float time[7];
public:
	Course(istream &is) {
		if (!is) return;
		string tmpLine;
		getline(is, tmpLine);
		vector<string> record = split(tmpLine, ',');
		for (vector<string>::iterator i=record.begin(); i != record.end(); ++i)
			*i=removeAllQuotes(*i);
		
		// Ignore the first column;
		record.at(0);

		// Second column has the course ID,
		//number = stringToInt(record.at(1));
		ID = record.at(1);
		number = parseID(ID);

		// Third column has the section,
		section = record.at(2)[0];

		// Fourth holds the lab boolean,
		if (record.at(3).empty())
			lab = false;
		else
			lab = true;

		// while Fifth contains the title of the course;
		title = record.at(4);

		// Sixth hands over the length (half semester or not)
		// it's actually an int that tells us how many times the course is offered per semester.
		half_semester = stringToInt(record.at(5));

		// Seventh tells us the number of credits,
		credits = stringToFloat(record.at(6));

		// Eighth shows us if it can be taken pass/no-pass, 
		if (record.at(7) == "Y")
			pass_fail = true;
		else
			pass_fail = false;

		// while Nine gives us the GEs of the course,
		// GEreqs = record.at(9);

		// and Ten spits out the days and times;
		// Times = record.at(10);

		// Eleven holds the location,
		location = record.at(11);

		// and Twelve knows who teaches.
		professor = record.at(12);
	}

	int parseID(string s) {
		// return stringToInt(s.substr(s.find(' ')+1,3)); // Xandra, what is this?
		string tempDept;
		unsigned int found = tempDept.find('/');
		tempDept = s.substr(0,s.find(' ')-1);
		if (found != s.npos) {
			department = new Department[2];
			string tmp = tempDept.substr(0,2);

			     if ( tmp == "AS" ) department[0] = ASIAN;
			else if ( tmp == "BI" ) department[0] = BIO;
			else if ( tmp == "CH" ) department[0] = CHEM;
			else if ( tmp == "ES" ) department[0] = ENVST;
			else if ( tmp == "HI" ) department[0] = HIST;
			else if ( tmp == "RE" ) department[0] = REL;

			tmp = tempDept.substr(3,2);
			     if ( tmp == "AS" ) department[1] = ASIAN;
			else if ( tmp == "BI" ) department[1] = BIO;
			else if ( tmp == "CH" ) department[1] = CHEM;
			else if ( tmp == "ES" ) department[1] = ENVST;
			else if ( tmp == "HI" ) department[1] = HIST;
			else if ( tmp == "RE" ) department[1] = REL;
		}
		else {
			     if ( tempDept == "AFAM"  ) department = AFAM;
			else if ( tempDept == "ALSO"  ) department = ALSO;
			else if ( tempDept == "AMCON" ) department = AMCON;
			else if ( tempDept == "AMST"  ) department = AMST;
			else if ( tempDept == "ARMS"  ) department = ARMS;
			else if ( tempDept == "ART"   ) department = ART;
			else if ( tempDept == "ASIAN" ) department = ASIAN;
			else if ( tempDept == "BIO"   ) department = BIO;
			else if ( tempDept == "BMOLS" ) department = BMOLS;
			else if ( tempDept == "CHEM"  ) department = CHEM;
			else if ( tempDept == "CHIN"  ) department = CHIN;
			else if ( tempDept == "CLASS" ) department = CLASS;
			else if ( tempDept == "CSCI"  ) department = CSCI;
			else if ( tempDept == "DANCE" ) department = DANCE;
			else if ( tempDept == "ECON"  ) department = ECON;
			else if ( tempDept == "EDUC"  ) department = EDUC;
			else if ( tempDept == "ENGL"  ) department = ENGL;
			else if ( tempDept == "ENVST" ) department = ENVST;
			else if ( tempDept == "ESAC"  ) department = ESAC;
			else if ( tempDept == "ESTH"  ) department = ESTH;
			else if ( tempDept == "FAMST" ) department = FAMST;
			else if ( tempDept == "FILM"  ) department = FILM;
			else if ( tempDept == "FREN"  ) department = FREN;
			else if ( tempDept == "GCON"  ) department = GCON;
			else if ( tempDept == "GERM"  ) department = GERM;
			else if ( tempDept == "GREEK" ) department = GREEK;
			else if ( tempDept == "HIST"  ) department = HIST;
			else if ( tempDept == "HSPST" ) department = HSPST;
			else if ( tempDept == "ID"    ) department = ID;
			else if ( tempDept == "IDFA"  ) department = IDFA;
			else if ( tempDept == "INTD"  ) department = INTD;
			else if ( tempDept == "IS"    ) department = IS;
			else if ( tempDept == "JAPAN" ) department = JAPAN;
			else if ( tempDept == "LATIN" ) department = LATIN;
			else if ( tempDept == "MATH"  ) department = MATH;
			else if ( tempDept == "MEDIA" ) department = MEDIA;
			else if ( tempDept == "MEDVL" ) department = MEDVL;
			else if ( tempDept == "MGMT"  ) department = MGMT;
			else if ( tempDept == "MUSIC" ) department = MUSIC;
			else if ( tempDept == "MUSPF" ) department = MUSPF;
			else if ( tempDept == "NEURO" ) department = NEURO;
			else if ( tempDept == "NORW"  ) department = NORW;
			else if ( tempDept == "NURS"  ) department = NURS;
			else if ( tempDept == "PHIL"  ) department = PHIL;
			else if ( tempDept == "PHYS"  ) department = PHYS;
			else if ( tempDept == "PSCI"  ) department = PSCI;
			else if ( tempDept == "PSYCH" ) department = PSYCH;
			else if ( tempDept == "REL"   ) department = REL;
			else if ( tempDept == "RUSSN" ) department = RUSSN;
			else if ( tempDept == "SCICN" ) department = SCICN;
			else if ( tempDept == "SOAN"  ) department = SOAN;
			else if ( tempDept == "SPAN"  ) department = SPAN;
			else if ( tempDept == "STAT"  ) department = STAT;
			else if ( tempDept == "SWRK"  ) department = SWRK;
			else if ( tempDept == "THEAT" ) department = THEAT;
			else if ( tempDept == "WMGST" ) department = WMGST;
			else if ( tempDept == "WRIT"  ) department = WRIT;
		}
	}

	void updateID() {
		ID = department.shorthand + tostring(number) + section;
	}
	string getID() {
		return ID;
	}

	ostream& getData(ostream &os) {
		os << ID << section << " ";
		os << title << "/";
		/*for (vector<Instructor>::iterator i = professor.begin(); i != professor.end(); ++i) {
		os << i->name << " ";
		}*/
		return os;
	}
	void display();
};	

ostream &operator<<(ostream &os, Course &item) { return item.getData(os); }
void Course::display() { if(this==0) cout << *this << endl; }

#endif

