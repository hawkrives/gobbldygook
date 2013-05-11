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
	Semester();
	Semester(int p);

	vector<Course> courses;
};

class Student {
private:
	void init(string n, int s, int g, string m);
public:
	string name;
	int startingYear, gradutationYear;

	vector<Major> majors;

	vector<Semester> year1;//(3);
	vector<Semester> year2;//(3);
	vector<Semester> year3;//(3);
	vector<Semester> year4;//(3);

	Student();
	Student(string fn);

	bool hasTakenCourse();
	void addCourse(const Course& c, const Semester& s);

	ostream& getData(ostream &os);
	void display();
};

#endif
