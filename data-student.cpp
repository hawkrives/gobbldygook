#include "data-student.hpp"
using namespace std;

void Student::init(string n, int s, int g, string m) {
	name = n;
	startingYear = s;
	gradutationYear = g;
	addMajors(m);
}

Student::Student() {
	init("", 2000, 2004, "");
}
Student::Student(string n, string s, string e, string m) {
	int startYear = stringToInt(s), endYear = stringToInt(e);
	init(n, startYear, endYear, m);
}

Student::Student(string fn) {
	string n, yearS, yearE, m, conc, c;
	ifstream infile(fn.c_str());
	string nextLine;
	vector<string> lines;

	// load the entire file
	while (infile.peek() != -1) {
		getline(infile, nextLine);
		lines.push_back(nextLine);
	}

	string previousHeading;
	for (vector<string>::iterator i = lines.begin(); i != lines.end(); ++i) {
		string str = *i;
		if (str[0] == '#') {
			previousHeading = *i;
			continue;
		}

		if (str != "") {
			if (previousHeading == "# NAME")
				n = str;
			else if (previousHeading == "# MAJORS")
				addMajor(Major(str));
			else if (previousHeading == "# CONCENTRATIONS")
				addMajor(Major(str));
			else if (previousHeading == "# COURSES")
				addCourse(Course(str));
		}
	}
}

void Student::addMajor(const Major &m) {
	majors.push_back(m);
}

void Student::addMajors(string str) {
	vector<string> record = split(str, ',');
	for (vector<string>::iterator i = record.begin(); i != record.end(); ++i) {
		string s = removeStartingText(str, " ");
		addMajor(Major(*i));
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
	courses.push_back(c);
}

void Student::addCourses(string str) {
	vector<string> record = split(str, ',');
	for (vector<string>::iterator i = record.begin(); i != record.end(); ++i) {
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
	return item.getData(os);
}
