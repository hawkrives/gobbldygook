#ifndef __Data_student__
#define __Data_student__

#include "data-general.hpp"
#include "data-major.hpp"
#include "data-course.hpp"
using namespace std;

class Semester {
private:
	int period;
public:
	Semester() {
		period = 0;
	}
	Semester(int p) {
		period = p;
	}

	vector<Course> courses;
};

class Student {
private:
	void init(string n, int s, int g, string m) {
		name = n;
		startingYear = s;
		gradutationYear = g;
		// parseMajors(m);

		year1.push_back(Semester(1));
		year1.push_back(Semester(2));
		year1.push_back(Semester(3));

		year2.push_back(Semester(1));
		year2.push_back(Semester(2));
		year2.push_back(Semester(3));
		
		year3.push_back(Semester(1));
		year3.push_back(Semester(2));
		year3.push_back(Semester(3));
		
		year4.push_back(Semester(1));
		year4.push_back(Semester(2));
		year4.push_back(Semester(3));
	}
public:
	string name;
	int startingYear, gradutationYear;

	vector<Major> majors;

	vector<Semester> year1;//(3);
	vector<Semester> year2;//(3);
	vector<Semester> year3;//(3);
	vector<Semester> year4;//(3);

	Student() {
		init("", 2000, 2004, "");
	}
	Student(string fn) {
		ifstream infile;
		infile.open(fn.c_str());
	}

	bool hasTakenCourse() {
		return false;
	}

	ostream& getData(ostream &os) {
		os << name << " ";
		return os;
	}
	void display();
};

#endif
