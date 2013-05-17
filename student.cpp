#include "student.hpp"
using namespace std;

void Student::init(string n, int s, int g, string m) {
	name = n;
	startingYear = s;
	graduationYear = g;
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
	string yearS, yearE;
	
	string contentsOfFile = getFileContents(fn);
	vector<string> lines = split(contentsOfFile, '\n');

	string previousHeading;
	for (vector<string>::iterator i = lines.begin(); i != lines.end(); ++i) {
		string str = *i;
		if (previousHeading.empty())
			previousHeading = "# NAME";
		if (str[0] == '#') {
			std::transform(str.begin(), str.end(), str.begin(), ::toupper);
			previousHeading = str;
			continue;
		}
		else if (str != "") {
			if (str.substr(0, 2) == "//") {
				// it's a comment
			}
			else if (previousHeading == "# NAME")
				name = str;
			else if (previousHeading == "# MAJORS")
				addMajor(Major(str));
			else if (previousHeading == "# CONCENTRATIONS")
				addConcentration(Concentration(str));
			else if (previousHeading == "# COURSES")
				addCourse(Course(str));
			else if (previousHeading == "# LABS")
				addCourse(Course(str));
		}
	}
}

void Student::addMajor(const Major& m) {
	majors.push_back(m);
}

void Student::addMajors(string str) {
	vector<string> record = split(str, ',');
	for (vector<string>::iterator i = record.begin(); i != record.end(); ++i)
		addMajor(Major(*i));
}

void Student::addConcentration(const Concentration& m) {
	concentrations.push_back(m);
}

void Student::addConcentrations(string str) {
	vector<string> record = split(str, ',');
	for (vector<string>::iterator i = record.begin(); i != record.end(); ++i)
		addConcentration(Concentration(*i));
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
	const Course checkAgainst = getCourse(str);
	for (std::vector<Course>::iterator i = courses.begin(); i != courses.end(); ++i)
		if (*i == checkAgainst)
			userHasTaken = true;
	return userHasTaken;
}

ostream& Student::getData(ostream &os) {
	os << name << ", ";
	
	if (majors.size()) {
		os << "you are majoring in ";
		
		for (vector<Major>::iterator i = majors.begin(); i != majors.end(); ++i){
			if (majors.size() == 1) {
				os << *i << " ";
			}
			else if (majors.size() == 2) {
				os << *i;
				if (i != majors.end()-1)
					os << " and ";
				else
					os << " ";
			}
			else {
				if (i != majors.end()-1)
					os << *i << ", ";
				else 
					os << "and " << *i << ", ";
			}
		}
	}
	
	if (concentrations.size()) {
		os << "with concentrations in ";
		
		for (vector<Concentration>::iterator i = concentrations.begin(); i != concentrations.end(); ++i) {
			if (concentrations.size() == 1) {
				os << *i << " ";
			}
			else if (concentrations.size() == 2) {
				os << *i;
				if (i != concentrations.end()-1)
					os << " and ";
				else
					os << " ";
			}
			else {
				if (i != concentrations.end()-1)
					os << *i << ", ";
				else
					os << "and " << *i << ", ";
			}
		}
	}
	
	if (!majors.size())
		os << "you are taking: " << endl;
	else
		os << "while taking:" << endl;

	for (vector<Course>::iterator i = courses.begin(); i != courses.end(); ++i) {
		os << *i << endl;
	}

	// TODO: don't cout an extra line at the end of the output.

	for (vector<Major>::iterator m = majors.begin(); m != majors.end(); ++m) {
		for (vector<MajorRequirement>::iterator req = m->requirements.begin(); req != m->requirements.end(); ++req)
			cout << *req << endl;
		for (vector<SpecialRequirement>::iterator set = m->specialRequirements.begin(); set != m->specialRequirements.end(); ++set)
			for (vector<MajorRequirement>::iterator req = set->validSets.begin(); req != set->validSets.end(); ++req)
				cout << *req << endl;
	}

	for (vector<Concentration>::iterator conc = concentrations.begin(); conc != concentrations.end(); ++conc) {
		for (vector<MajorRequirement>::iterator req = conc->requirements.begin(); req != conc->requirements.end(); ++req)
			cout << *req << endl;
		for (vector<SpecialRequirement>::iterator set = conc->specialRequirements.begin(); set != conc->specialRequirements.end(); ++set)
			for (vector<MajorRequirement>::iterator req = set->validSets.begin(); req != set->validSets.end(); ++req)
				cout << *req << endl;
	}

	return os;
}

void Student::updateStanding() {
	for (vector<Major>::iterator m = majors.begin(); m != majors.end(); ++m) {
		for (vector<Course>::iterator c = courses.begin(); c != courses.end(); ++c) {
			for (vector<MajorRequirement>::iterator req = m->requirements.begin(); req != m->requirements.end(); ++req) {
				if (req->checkCourseValidity(c->getID())) {
					req->incrementHas();
				}
			}
			for (vector<SpecialRequirement>::iterator set = m->specialRequirements.begin(); set != m->specialRequirements.end(); ++set) {
				for (vector<MajorRequirement>::iterator req = set->validSets.begin(); req != set->validSets.end(); ++req) {
					if (req->checkCourseValidity(c->getID())) {
						req->incrementHas();
					}
				}
			}
		}
	}
	for (vector<Concentration>::iterator conc = concentrations.begin(); conc != concentrations.end(); ++conc) {
		for (vector<Course>::iterator c = courses.begin(); c != courses.end(); ++c) {
			for (vector<MajorRequirement>::iterator req = conc->requirements.begin(); req != conc->requirements.end(); ++req) {
				if (req->checkCourseValidity(c->getID())) {
					req->incrementHas();
				}
			}
			for (vector<SpecialRequirement>::iterator set = conc->specialRequirements.begin(); set != conc->specialRequirements.end(); ++set) {
				for (vector<MajorRequirement>::iterator req = set->validSets.begin(); req != set->validSets.end(); ++req) {
					if (req->checkCourseValidity(c->getID())) {
						req->incrementHas();
					}
				}
			}
		}
	}
}

void Student::display() {
	cout << *this << endl;
}

ostream& operator<<(ostream& os, Student& item) {
	return item.getData(os);
}
