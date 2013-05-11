#include "data-student.hpp"
using namespace std;


Semester::Semester() {
	period = 0;
}
Semester::Semester(int p) {
	period = p;
}

void Student::init(string n, int s, int g, string m) {
	name = n;
	startingYear = s;
	gradutationYear = g;
	// parseMajors(m);
}

Student::Student() {
	init("", 2000, 2004, "");
}
Student::Student(string fn) {
	ifstream infile;
	infile.open(fn.c_str());
}

bool Student::hasTakenCourse() {
	return false;
}

void Student::addCourse(const Course& c, const Semester& s) {
	// s.push_back();
}

ostream& Student::getData(ostream &os) {
	os << name << " ";
	return os;
}
void Student::display() {

};
