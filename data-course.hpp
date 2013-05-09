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
	vector<Department> department;
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
		getline(is, tmpLine); // remove the extra data of course status

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

	void parseID(string str) {
		unsigned int foundLoc = str.find('/');
		string tempDept = str.substr(0,str.find(' ')-1);

		if (foundLoc != str.npos) {
			string dept1 = tempDept.substr(0,2);
			department.push_back(Department(dept1));

			string dept2 = tempDept.substr(2,2);
			department.push_back(Department(dept2));
		}
		else {
			department.push_back(Department(tempDept));
		}
	}

	void updateID() {
		string dept;
		for (std::vector<Department>::iterator i = department.begin(); i != department.end(); ++i)
			dept += i->getName();
		ID = dept + tostring(number) + section;
	}
	string getID() {
		return ID;
	}

	ostream& getData(ostream &os) {
		os << ID << section << " - ";
		os << title << " | ";
		// os << professor << endl;
		return os;
	}
	void display();
};	

ostream &operator<<(ostream &os, Course &item) { return item.getData(os); }
void Course::display() { if(this==0) cout << *this << endl; }

#endif

