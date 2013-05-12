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

void Student::parseMajors(string str) {
	vector<string> record = split(str, ',');
	for (vector<string>::iterator i = record.begin(); i != record.end(); ++i) {
		string s = removeStartingText(*i, " ");
		std::transform(s.begin(), s.end(), s.begin(), ::toupper);
		Major m = Major(s);
		majors.push_back(m);
	}
}

bool Student::hasTakenCourse(string str) {
	bool userHasTaken = false;
	Course checkAgainst = getCourse(str);
	for (std::vector<Course>::iterator i = courses.begin(); i != courses.end(); ++i)
		if (*i == checkAgainst)
			userHasTaken = true;
	return userHasTaken;
}

void Student::addCourse(const Course& c) {
	// cout << "Hi! I'm addCourse (not courses!!)!" << endl;
	courses.push_back(c);
	// cout << courses.at(courses.size()-1) << endl;
}

void Student::addCourses(string str) {
	// cout << "Hi! I'm addCourses!" << endl;
	vector<string> record = split(str, ',');
	for (vector<string>::iterator i = record.begin(); i != record.end(); ++i) {
		// cout << *i << endl;
		addCourse(Course(*i));
	}
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
