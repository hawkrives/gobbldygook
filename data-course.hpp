#ifndef __Data_course__
#define __Data_course__

#include "data-general.hpp"
#include "data-major.hpp"
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
	vector<Concentration> concentrations;
	vector<Conversation> conversations;
	vector<Instructor> professor;

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
		// Instructors = record.at(12);
	}
	/* void parseID(char* str) {
		string tmp = str;
		ID = tmp;
		// TODO: do this.
	}*/
	int parseID(string s) {
		return stringToInt(s.substr(s.find(' ')+1,3));
		string tempDept, tempDept0, tempDept1;
		unsigned found = tempDept.find('/');
		tempDept = s.substr(0,s.find(' ')-1);
		if (found!=std::string::npos) {
		  department = new Department[2];
		  tempDept0 = tempDept.substr(0,2);
		  tempDept1 = tempDept.substr(3,2);
		  switch (tempDept0) {
		  case 'AS': department[0] = ASIAN; break;
		  case 'BI': department[0] = BIO; break;
		  case 'CH': department[0] = CHEM; break;
		  case 'ES': department[0] = ENVST; break;
		  case 'HI': department[0] = HIST; break;
		  case 'RE': department[0] = REL; break;
		  }
		  switch (tempDept1) {
		  case 'AS': department[1] = ASIAN; break;
		  case 'BI': department[1] = BIO; break;
		  case 'CH': department[1] = CHEM; break;
		  case 'ES': department[1] = ENVST; break;
		  case 'HI': department[1] = HIST; break;
		  case 'RE': department[1] = REL; break;
		  }
		}
		else {
		  department = new Department[1];
		  switch (tempDept) {
		  case 'AFAM': department[0] = AFAM; break;
		  case 'ALSO': department[0] = ALSO; break;
		  case 'AMCON': department[0] = AMCON; break;
		  case 'AMST': department[0] = AMST; break;
		  case 'ARMS': department[0] = ARMS; break;
		  case 'ART': department[0] = ART; break;
		  case 'ASIAN': department[0] = ASIAN; break;
		  case 'BIO': department[0] = BIO; break;
		  case 'BMOLS': department[0] = BMOLS; break;
		  case 'CHEM': department[0] = CHEM; break;
		  case 'CHIN': department[0] = CHIN; break;
		  case 'CLASS': department[0] = CLASS; break;
		  case 'CSCI': department[0] = CSCI; break;
		  case 'DANCE': department[0] = DANCE; break;
		  case 'ECON': department[0] = ECON; break;
		  case 'EDUC': department[0] = EDUC; break;
		  case 'ENGL': department[0] = ENGL; break;
		  case 'ENVST': department[0] = ENVST; break;
		  case 'ESAC': department[0] = ESAC; break;
		  case 'ESTH': department[0] = ESTH; break;
		  case 'FAMST': department[0] = FAMST; break;
		  case 'FILM': department[0] = FILM; break;
		  case 'FREN': department[0] = FREN; break;
		  case 'GCON': department[0] = GCON; break;
		  case 'GERM': department[0] = GERM; break;
		  case 'GREEK': department[0] = GREEK; break;
		  case 'HIST': department[0] = HIST; break;
		  case 'HSPST': department[0] = HSPST; break;
		  case 'ID': department[0] = ID; break;
		  case 'IDFA': department[0] = IDFA; break;
		  case 'INTD': department[0] = INTD; break;
		  case 'IS': department[0] = IS; break;
		  case 'JAPAN': department[0] = JAPAN; break;
		  case 'LATIN': department[0] = LATIN; break;
		  case 'MATH': department[0] = MATH; break;
		  case 'MEDIA': department[0] = MEDIA; break;
		  case 'MEDVL': department[0] = MEDVL; break;
		  case 'MGMT': department[0] = MGMT; break;
		  case 'MUSIC': department[0] = MUSIC; break;
		  case 'MUSPF': department[0] = MUSPF; break;
		  case 'NEURO': department[0] = NEURO; break;
		  case 'NORW': department[0] = NORW; break;
		  case 'NURS': department[0] = NURS; break;
		  case 'PHIL': department[0] = PHIL; break;
		  case 'PHYS': department[0] = PHYS; break;
		  case 'PSCI': department[0] = PSCI; break;
		  case 'PSYCH': department[0] = PSYCH; break;
		  case 'REL': department[0] = REL; break;
		  case 'RUSSN': department[0] = RUSSN; break;
		  case 'SCICN': department[0] = SCICN; break;
		  case 'SOAN': department[0] = SOAN; break;
		  case 'SPAN': department[0] = SPAN; break;
		  case 'STAT': department[0] = STAT; break;
		  case 'SWRK': department[0] = SWRK; break;
		  case 'THEAT': department[0] = THEAT; break;
		  case 'WMGST': department[0] = WMGST; break;
		  case 'WRIT': department[0] = WRIT; break;
		  }
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

