#ifndef __Data_course__
#define __Data_course__

//data-course.hpp
#include "data-general.hpp"

class Course {
protected:
	string ID;
	int number;
	string title;
	string description;
	char section;
	
	vector<Major> majors;
	Department department;
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

#endif

