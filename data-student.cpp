#include "data-student.hpp"
using namespace std;

void Student::init(string n, int s, int g, string m) {
	name = n;
	startingYear = s;
	gradutationYear = g;
	parseMajors(m);
}

Student::Student() {
	init("", 2000, 2004, "");
}
Student::Student(string n, string s, string e, string m) {
	int startYear = stringToInt(s), endYear = stringToInt(e);
	init(n, startYear, endYear, m);
}
Student::Student(string fn) {
	ifstream infile;
	infile.open(fn.c_str());
}

	}
}

void Student::addMajor(const Major& m) {
	majors.push_back(m);
}

void Student::addMajors(string str) {
	vector<string> record = split(str, ',');
	for (vector<string>::iterator i = record.begin(); i != record.end(); ++i)
		addMajor(*i);
}

void Student::addCourse(const Course& c) {
	courses.push_back(c);
}

void Student::addCourses(string str) {
	vector<string> record = split(str, ',');
	for (vector<string>::iterator i = record.begin(); i != record.end(); ++i)
		addCourse(Course(*i));
}

bool Student::hasTakenCourse(string str) {
	bool userHasTaken = false;
	Course checkAgainst = getCourse(str);
	for (std::vector<Course>::iterator i = courses.begin(); i != courses.end(); ++i)
		if (*i == checkAgainst)
			userHasTaken = true;
	return userHasTaken;
}

ostream& Student::getData(ostream &os) {
	os << name << ", ";
	os << "you are majoring in ";
	for (vector<Major>::iterator i = majors.begin(); i != majors.end(); ++i){
		if (majors.size() == 2) {
			if (i != majors.end()-1)
				os << *i << " and ";
			else
				os << *i << " ";
		}
		else {
			if (i != majors.end()-1)
				os << *i << ", ";
			else 
				os << "and " << *i << ", ";
		}
	}
	os << "while taking:" << endl;
	for (vector<Course>::iterator i = courses.begin(); i != courses.end(); ++i)
		os << *i << endl;
	return os;
}

void Student::display() {
	cout << *this << endl;
};

ostream& operator<<(ostream& os, Student& item) {
	os << item.getData(os);
	return os;
}
