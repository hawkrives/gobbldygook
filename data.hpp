#ifndef __Data__
#define __Data__

#include <iostream>
#include <sstream>
#include <fstream>
#include <vector>
#include <algorithm>    // has the for_each

using namespace std;

string tostring(int i) {
	ostringstream tmp;
	tmp << i;
	return tmp.str();
}

int stringToInt(string const& str) {
  istringstream i(str);
  int x;
  i >> x;
  return x;
}

float stringToFloat(string const& str) {
  istringstream i(str);
  float x;
  i >> x;
  return x;
}

vector<string> &split(const string &s, char delim, vector<string> &elems) {
    stringstream ss(s);
    string item;
    while (getline(ss, item, delim)) {
        elems.push_back(item);
    }
    return elems;
}

vector<string> split(const string &s, char delim) {
	// taken from http://stackoverflow.com/a/236803
    vector<string> elems;
    split(s, delim, elems);
    return elems;
}

string removeAllQuotes(string s) {
  s.erase(remove(s.begin(), s.end(), '\"'), s.end());
  return s;
}

enum GenEd {
	// Foundation Studies
	FYW,   // First-Year Writing 
	WRI,   // Writing in Context
	FOL,   // Foreign Language
	ORC,   // Oral Communication
	AQR,   // Abstract and Quantitative Reasoning
	SPM,   // Studies in Physical Movement

	// Core Studies
	HWC,   // Historical Studies in Western Culture
	MCD,   // Multicultural Studies: Domestic
	MCG,   // Multicultural Studies: Global
	ALSA,  // Artistic and Literary Studies: Artistic Studies
	ALSL,  // Artistic and Literary Studies: Literary Studies
	BTSB,  // Biblical and Theological Studies: Bible
	BTST,  // Biblical and Theological Studies: Theology
	SED,   // Studies in Natural Science: Scientific Exploration and Discovery
	IST,   // Studies in Natural Science: Integrated Scientific Topics
	HBS,   // Studies in Human Behavior and Society

	// Integrative Studies
	EIN    // Ethical Issues and Normative Perspectives
};


struct Instructor {
	string name;
	string specialty;
};

struct Department {
	string name;
	string shorthand;
};

struct Major {
	string name;
	int difficulty;
};

struct Concentration {
	string name;
	int difficulty;
};

struct Conversation {
	string name;
	int difficulty;
};

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
		if (is == 0) return;
		string tmpLine;
		getline(is, tmpLine);
		vector<string> record = split(tmpLine, ',');
		for (vector<string>::iterator i=record.begin(); i != record.end(); ++i)
		  *i=removeAllQuotes(*i);
		
		// Ignore the first column;
		record.at(0);

		// Second column has the course ID,
		number = stringToInt(record.at(1));

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
	void parseID(char* str) {
		string tmp = str;
		ID = tmp;
		// TODO: do this.
	}
	void updateID() {
		ID = department.shorthand + tostring(number) + section;
	}
	string getID() {
		return ID;
	}
	
	ostream& getData(ostream &os) {
		os << ID << " ";
		os << title << "/";
		for (vector<Instructor>::iterator i = professor.begin(); i != professor.end(); ++i) {
			os << i->name << " ";
		}
		return os;
	}
	void display();
};

ostream &operator<<(ostream &os, Course &item) { return item.getData(os); }
void Course::display() { cout << *this << endl; }

void spit(Course n) {
	n.display();
}

class Student {
public:
	string name;
	vector<Course> takenCourses;
	vector<Major> majors;
	vector<Concentration> concentrations;
	vector<Conversation> conversations;
	vector<Instructor> favInstructors;
	
	string interests;
	double gradYear;
	
	ostream& getData(ostream &os) {
		os << name << " ";
		
		for (vector<Course>::iterator i = takenCourses.begin(); i != takenCourses.end(); ++i)
			os << i->getID() << " ";
		
		for (vector<Major>::iterator i = majors.begin(); i != majors.end(); ++i)
			os << i->name << " ";
		
		return os;
	}
	void display();
};

#endif

