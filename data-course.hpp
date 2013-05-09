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
		for (vector<string>::iterator i=record.begin(); i != record.end(); ++i) {
			*i = removeAllQuotes(*i);
			*i = removeTrailingSlashes(*i);
		}
		
		// Ignore the first column;
		record.at(0);

		// so, the *first* column (that we care about) has the course ID,
		ID = record.at(1);
		parseID(ID);

		// Second column has the section,
		section = record.at(2)[0];

		// Third holds the lab boolean,
		if (record.at(3).empty()) lab = false;
		else                      lab = true;

		// while Fourth contains the title of the course;
		title = record.at(4);
		vector<string> badEndings;
		badEndings.push_back("Prerequisite");
		badEndings.push_back("This course has class");
		badEndings.push_back("This course is open to ");
		badEndings.push_back("First-Year Students may register only");
		badEndings.push_back("Open to ");
		badEndings.push_back("Especially for ");
		badEndings.push_back("Registration by permission of instructor only.");
		badEndings.push_back("Not open to first-year students.");
		badEndings.push_back("Students in " + department[0].getFullName() + " " + tostring(number));

		for (vector<string>::iterator i=badEndings.begin(); i != badEndings.end(); ++i) {
			title = removeTrailingText(title, *i);
		}
		

		// Fifth hands over the length (half semester or not)
		// it's actually an int that tells us how many times the course is offered per semester.
		half_semester = stringToInt(record.at(5));

		// Sixth tells us the number of credits,
		credits = stringToFloat(record.at(6));

		// Seventh shows us if it can be taken pass/no-pass, 
		if (record.at(7) == "Y")
			pass_fail = true;
		else
			pass_fail = false;

		// while Eighth gives us the GEs of the course,
		// GEreqs = record.at(8);

		// and Nine spits out the days and times;
		// Times = record.at(9);

		// Ten holds the location,
		location = record.at(10);

		// and Eleven knows who teaches.
		// professor = record.at(12);
		professor = record.at(11);
		// This has a SIGABRT error.
		if (record.size() == 13) {
			string profLastName = professor;
			string profFirstName = record.at(12);
			cout << profFirstName << " " << profLastName << endl;
			professor = profFirstName + " " + profLastName;
		}
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
		ID = dept + " " + tostring(number) + section;
	}
	string getID() {
		return ID;
	}

	ostream& getData(ostream &os) {
		os << ID << section << " - ";
		os << title << " | ";
		// os << professor;
		return os;
	}
	void display();
};	

	void showAll() {
		cout << ID << section << endl;
		cout << "Title: " << title << endl;
		cout << "Professor: " << professor << endl;
		cout << "Lab? " << lab << endl;
		cout << "Half-semester? " << half_semester << endl;
		cout << "Credits: " << credits << endl;
		cout << "Pass/Fail? " << pass_fail << endl;
		cout << "Location: " << location << endl;
		cout << endl;
	}
};

ostream &operator<<(ostream &os, Course &item) { return item.getData(os); }
void Course::display() { if(this==0) cout << *this << endl; }

#endif

