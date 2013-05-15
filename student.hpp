#ifndef __Data_student__
#define __Data_student__

#include "data-general.hpp"
#include "data-major.hpp"
#include "data-concentration.hpp"
#include "data-course.hpp"
using namespace std;

class Student {
private:
	void init(string n, int s, int g, string m);
public:
	string name;
	int startingYear, gradutationYear;

	vector<Major> majors;
	vector<Concentration> concentrations;
	vector<Course> courses;

	Student();
	Student(string n, string s, string e, string m);
	Student(string fn);

	bool hasTakenCourse(string str);
	void addCourse(const Course& c);
	void addCourses(string str);
	void addLab(const Course& c);
	void addLabs(string str);

	void addMajor(const Major& m);
	void addMajors(string str);
	void addConcentration(const Concentration& m);
	void addConcentrations(string str);

	ostream& getData(ostream &os);
	void display();
};

extern Student user;

ostream& operator<<(ostream& os, Student& item);

#endif
