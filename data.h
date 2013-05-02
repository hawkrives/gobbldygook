#ifndef __Data__
#define __Data__

using namespace std;
#include <sstream>
#include <fstream>
#include <vector>

enum gened {
	AQR,
	MSC
};

int stringToInt(string s){
	int thevalue;
	istringstream ss(s);
	ss >> thevalue;
	return thevalue;
}

class Instructor {
protected:
	string name;
	//  Department department;
	string specialty;
};

class Department {
protected:
	string name;
	//  Course** courses;
	Instructor** professors;
};

class Major {
protected:
	string name;
	//  Course** courses;
	int difficulty;
};

class Concentration {
protected:
	string name;
	//  Course** courses;
	int difficulty;
};

class Conversation {
protected:
	string name;
	//  Course** courses;
	int difficulty;
};

class Course {
protected:
	Department department;
	int number;
	string section;
	Major** majors;
	Concentration** concentrations;
	Conversation** conversations;
	string title;
	Instructor* professor;
	string description;
	float credits;
	string location;
	bool lab;
	gened geneds;
	bool days;
	float time;
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
};

class Student {
protected:
	string name;
	Course** takenCourses;
	Major** majors;
	Concentration** concentrations;
	Conversation** conversations;
	Instructor** favInstructors;
	string interests;
	double gradYear;
};

#endif