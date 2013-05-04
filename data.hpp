#ifndef __Data__
#define __Data__

#include <iostream>
#include <sstream>
#include <fstream>
#include <vector>
#include <algorithm>    // has the for_each
#include "templates.h"

using namespace std;

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
	string section;
	
	vector<Major> majors;
	Department department;
	vector<Concentration> concentrations;
	vector<Conversation> conversations;
	vector<Instructor> professor;

	float credits;
	string location;

	bool lab;
	GenEd geneds;

	bool days[7];
	float time[7];
public:
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
		if (L != "") {lab = true;}
		else {lab = false;}
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

ostream &operator<<(ostream &os, Course &item) { return item.getData(os); }
void Course::display() { cout << *this << endl; }

Course spit(Course n) {
	return n;
}

int stringToInt(string s){
	int thevalue;
	istringstream ss(s);
	ss >> thevalue;
	return thevalue;
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
