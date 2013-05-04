#ifndef __Data__
#define __Data__

#include <sstream>
#include <fstream>
#include <vector>
#include <algorithm>    // has the for_each
#include "templates.h"

using namespace std;

enum gened {
	AQR,  // Abstract and Quantitative Reasoning
	FYW,  // First-Year Writing
	WRI,  // Writing In Context
	FOL,  // Foreign Language
	ORC,  // Oral Communication
	SPM,  // Studies in Physical Movement
	HWC,  // Historical Studies in Western Culture
	MCD,  // Multicultural Studies - Domestic
	MCG,  // Multicultural Studies - Global
	ALSA, // Artistic and Literary Studies - Art
	ALSL, // Artistic and Literary Studies - Literature
	BTSB, // Biblical and Theological Studies - Bible
	BTST, // Biblical and Theological Studies - Theology
	SED,  // Scientific Exploration and Discovery
	IST,  // Integrated Scientific Topics
	HBS,  // Studies in Human Behavior and Society
	EIN   // Ethical Issues and Normative Perspectives
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
	string section;
	
	vector<Major> majors;

	Department department;
	vector<Instructor> professor;
	
	vector<Concentration> concentrations;
	vector<Conversation> conversations;
	
	float credits;
	string location;
	gened geneds;
	bool lab;

	bool days[7];
	float time;
public:
	Course(int num, string name, string sect, Department dept) {
		number = num;
		title = name;
		section = sect;
		department = dept;
	}
	Course(istream & is) {
		string St, Num, L, half, CR, PN, GEreqs, Times, Instructors;
		//	getline(is, St, ",");
		//	getline(is, Num, ",");
		//	getline(is, section, ",");
		//	getline(is, L, ",");
		//	getline(is, title, ",");
		//	getline(is, half, ",");
		//	getline(is, CR, ",");
		//	getline(is, PN, ",");
		//	getline(is, GEreqs, ",");
		//	getline(is, Times, ",");
		//	getline(is, location, ",");
		//	getline(is, Instructors, ",");
		//	number = stringToInt(Num);
		if (L != "")
			lab = true;
		else
			lab = false;
		//functions to look up instructors and such
	}
	
	void updateID() {
		ID = department.shorthand + lexical_cast<string>(number) + section;
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

ostream &operator<<(ostream &os, Course &item) {
	return item.getData(os);
}

void Course::display() {
	cout << *this << endl;
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

ostream &operator<<(ostream &os, Student &item) { return item.getData(os); }
void Student::display() { cout << *this << endl; }

Course spit(Course n) {
	return n;
}

int stringToInt(string s){
	int thevalue;
	istringstream ss(s);
	ss >> thevalue;
	return thevalue;
}

#endif
