#include "data-course.hpp"
using namespace std;


void Course::init(string identifier) {
	// Remove a possible space at the front
	if (identifier[0] == ' ')
		identifier.erase(0, 1);

	// add a space into the course id, if there isn't one already
	int shouldBeSpaceIndex = identifier.length()-4;
	if (identifier[shouldBeSpaceIndex] != ' ')
		identifier.insert(shouldBeSpaceIndex+1, 1, ' ');
	
	// cout << identifier << endl;
	copy(getCourse(identifier));
}
void Course::copy(const Course& c) {
	id = c.id;
	number = c.number;
	title = c.title;
	description = c.description;
	section = c.section;
	majors = c.majors;
	department = c.department;
	concentrations = c.concentrations;
	conversations = c.conversations;
	professor = c.professor;

	half_semester = c.half_semester;
	pass_fail = c.pass_fail;
	credits = c.credits;
	location = c.location;

	lab = c.lab;
	geneds = c.geneds;

	for (int i = 0; i < 7; ++i){
		days[i] = c.days[i];
		time[i] = c.time[i];
	}
}	

Course::Course() {

}

Course::Course(string str) {
	init(str);
}

Course::Course(const Course& c) {
	copy(c);
}

Course& Course::operator = (const Course &c) {
	if (this == &c) return *this;
	copy(c);
	return *this;
}

Course::Course(istream &is) {
	if (!is) return;

	string tmpLine;
	getline(is, tmpLine); // read in so we can do things with it.

	vector<string> record = split(tmpLine, ',');
	for (vector<string>::iterator i=record.begin(); i != record.end(); ++i) {
		*i = removeAllQuotes(*i);
		*i = removeTrailingSlashes(*i);
	}

	/*
		cout << record.at(0) << ", ";
		cout << record.at(1) << ", ";
		cout << record.at(2) << ", ";
		cout << record.at(3) << ", ";
		cout << record.at(4) << ", ";
		cout << record.at(5) << ", ";
		cout << record.at(6) << ", ";
		cout << record.at(7) << ", ";
		cout << record.at(8) << ", ";
		cout << record.at(9) << ", ";
		cout << record.at(10) << ", ";
		cout << record.at(11) << ", ";
		if (record.size() == 13)
			cout << record.at(12) << endl;
	*/
	
	// Ignore the first column;
	// record.at(0);

	// so, the *first* column (that we care about) has the course id,
	id = record.at(1);
	parseID(id);

	// Second column has the section,
	// note that this breaks if it is a string.
		// it breaks after PHYS 125 lab.
		// it also doesn't output on anything.
	section = record.at(2)[0];

	// Third holds the lab boolean,
	if (record.at(3).empty()) lab = false;
	else                      lab = true;

	// while Fourth contains the title of the course;
	title = record.at(4);
	cleanTitle();

	// Fifth hands over the length (half semester or not)
	// it's actually an int that tells us how many times the course is offered per semester.
	half_semester = stringToInt(record.at(5));
	if (half_semester != 0 && half_semester != 1 && half_semester != 2)
		half_semester = 0;

	// Sixth tells us the number of credits,
	credits = stringToFloat(record.at(6));

	// Seventh shows us if it can be taken pass/no-pass, 
	if (record.at(7) == "Y")
		pass_fail = true;
	else
		pass_fail = false;

	// while Eighth gives us the GEs of the course,
	// GEreqs = record.at(8);

	// and Nine spits out the days and times;
	// Times = record.at(9);

	// Ten holds the location,
	location = record.at(10);
	location = deDoubleString(location);

	// and Eleven knows who teaches.
	if (record.size() == 13) {
		string profLastName = record.at(11);
		string profFirstName = record.at(12);
		profFirstName.erase(0, 1); // remove the extra space from the start of the name
		professor = profFirstName + " " + profLastName;
	}
	else {
		professor = record.at(11);
	}
}


void Course::cleanTitle() {
	// TODO: Refactor this to work on strings.
	vector<string> badEndings, badBeginnings;

	badEndings.push_back("Prerequisite");
	badEndings.push_back("Prerequsiite");
	badEndings.push_back("This course has class");
	badEndings.push_back("This course is open to ");
	badEndings.push_back("First-Year Students may register only");
	badEndings.push_back("Open to ");
	badEndings.push_back("Especially for ");
	badEndings.push_back("Registration by permission of instructor only.");
	badEndings.push_back("Permission of instructor required.");
	badEndings.push_back("Not open to first-year students.");
	badEndings.push_back("Film screenings");
	badEndings.push_back("Open only to ");
	badEndings.push_back("This course has been canceled.");
	badEndings.push_back("This course has been cancelled.");
	badEndings.push_back("Open only to seniors");
	badEndings.push_back("Closed during web registration.");
	badEndings.push_back("During course submission process");
	badEndings.push_back("Taught in English.");
	badEndings.push_back("Closed to First-Year Students.");
	badEndings.push_back("Closed to first-year students.");
	badEndings.push_back("New course");
	badEndings.push_back("This course does");
	badEndings.push_back("This course open to seniors only.");
	badEndings.push_back("This lab has been canceled.");
	badEndings.push_back("Permission of the instructor");
	badEndings.push_back("Registration restricted");
	badEndings.push_back("Students in " + department[0].getFullName() + " " + tostring(number));
	badEndings.push_back("Students in " + department[0].getName() + " " + tostring(number));

	badBeginnings.push_back("Top: ");
	badBeginnings.push_back("Sem: ");
	badBeginnings.push_back("Res: ");

	for (vector<string>::iterator i=badEndings.begin(); i != badEndings.end(); ++i)
		title = removeTrailingText(title, *i);
	for (vector<string>::iterator i=badBeginnings.begin(); i != badBeginnings.end(); ++i)
		title = removeStartingText(title, *i);
}

void Course::parseID(string str) {
	// Get the number of the course, aka the last three slots.
	stringstream(str.substr(str.size() - 3)) >> number;

	// Check if it's one of those dastardly "split courses".
	string dept = str.substr(0,str.size()-3);

	if (str.find('/') != string::npos) {
		department.push_back(Department(dept.substr(0,2)));
		department.push_back(Department(dept.substr(3,2)));
	}
	else {
		department.push_back(Department(dept));
	}
	updateID();
}

void Course::updateID() {
	string dept;
	for (std::vector<Department>::iterator i = department.begin(); i != department.end(); ++i) {
		dept += i->getName();
		if (department.size() > 1)
			dept += "/";
	}
	// ignore section until we get it assigning properly in the constructor
	id = dept + " " + tostring(number);// + section;
}
string Course::getID() {
	return id;
}

ostream& Course::getData(ostream &os) {
	os << id << " - ";
	os << title << " | ";
	if (professor.length() > 0 && professor != " ")
		os << professor;
	return os;
}

void Course::showAll() {
	cout << id << section << endl;
	cout << "Title: " << title << endl;
	cout << "Professor: " << professor << endl;
	cout << "Lab? " << lab << endl;
	cout << "Half-semester? " << half_semester << endl;
	cout << "Credits: " << credits << endl;
	cout << "Pass/Fail? " << pass_fail << endl;
	cout << "Location: " << location << endl;
	cout << endl;
}

ostream &operator<<(ostream &os, Course &item) { 
	return item.getData(os); 
}

void Course::display() { 
	if (this == 0) 
		cout << *this << endl; 
}

Course getCourse(string id) {
	std::transform(id.begin(), id.end(), id.begin(), ::toupper);
	for (vector<Course>::iterator i = all_courses.begin(); i != all_courses.end(); ++i) {
		if (i->getID() == id) {
			return *i;
		}
	}
	return Course();
}
