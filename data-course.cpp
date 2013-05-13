#include "data-course.hpp"
using namespace std;


//////////////
/////////////
// Constructor helper methods
///////////
//////////

void Course::init(string identifier) {
	// cout << identifier << endl;
	copy(getCourse(identifier));
}
void Course::copy(const Course& c) {
	id = c.id;
	title = c.title;
	description = c.description;
	majors = c.majors;
	department = c.department;
	concentrations = c.concentrations;
	conversations = c.conversations;
	professor = c.professor;

	half_semester = c.half_semester;
	pass_fail = c.pass_fail;
	credits = c.credits;
	location = c.location;

	courseType = c.courseType;
	geneds = c.geneds;

	for (int i = 0; i < 7; ++i){
		days[i] = c.days[i];
		time[i] = c.time[i];
	}
}


//////////////
/////////////
// Constructors
///////////
//////////

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
	// cout << "Now indise Course()" << endl;
	if (!is) return;
	// cout << "Now inside Course(after return)" << endl;

	string tmpLine;
	getline(is, tmpLine); // read in so we can do things with it.

	vector<string> record = split(tmpLine, ',');
	for (vector<string>::iterator i=record.begin(); i != record.end(); ++i) {
		*i = removeAllQuotes(*i);
		*i = removeTrailingSlashes(*i);
	}

	// printEntireRecord(record);

	// Ignore the first column;
	// record.at(0);

	// so, the *first* column (that we care about) has the course id,
	// and the second column has the section,
	string str = record.at(1) + record.at(2);
	id = ID(str);

	// Third holds the lab boolean,
	     if (record.at(3) == "L") courseType = LAB;
	else if (record.at(3) == "S") courseType = SEMINAR;
	else if (record.at(3) == "T") courseType = TOPIC;
	else                          courseType = COURSE;

	// while Fourth contains the title of the course;
	title = record.at(4);

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
	// location = deDoubleString(location);

	// and Eleven knows who teaches.
	if (record.size() == 13) {
		string profLastName = record.at(11);
		string profFirstName = record.at(12);
		profFirstName.erase(0, 1); // remove the extra space from the start of the name
		professor = profFirstName + " " + profLastName;
	}
	else
		professor = record.at(11);

	title = cleanTitle(title);
	record.clear();
}

string Course::cleanTitle(string title) {
	vector<string> badEndings, badBeginnings;

	badEndings.push_back(" Closed");
	badEndings.push_back(" During course submission process");
	badEndings.push_back(" Especially for ");
	badEndings.push_back(" Film screenings");
	badEndings.push_back(" First-Year Students may register only");
	badEndings.push_back(" New course");
	badEndings.push_back(" Not open to first-year students.");
	badEndings.push_back(" Open only to ");
	badEndings.push_back(" Open to ");
	badEndings.push_back(" Permission of ");
	badEndings.push_back(" Prereq");
	badEndings.push_back(" Registration");
	badEndings.push_back(" Taught in English.");
	badEndings.push_back(" This course");
	badEndings.push_back(" This lab has been canceled.");
	badEndings.push_back(" Students in ");

	badBeginnings.push_back("Top: ");
	badBeginnings.push_back("Sem: ");
	badBeginnings.push_back("Res: ");

	for (vector<string>::iterator i=badEndings.begin(); i != badEndings.end(); ++i)
		title = removeTrailingText(title, *i);
	for (vector<string>::iterator i=badBeginnings.begin(); i != badBeginnings.end(); ++i)
		title = removeStartingText(title, *i);

	return title;
}


//////////////
/////////////
// Getters
///////////
//////////
string Course::getType() {
	     if (courseType == LAB    ) return "Lab";
	else if (courseType == SEMINAR) return "Seminar";
	else if (courseType == TOPIC  ) return "Topic";
	else                            return "Course";
}

string Course::getProfessor() {
	return professor;
}

ID Course::getID() {
	return id;
}

Department Course::getDepartment(int i = 0) {
	return department[i];
}

int Course::getNumber() {
	return id.getNumber();
}

string Course::getSection() {
	return id.getSection();
}


//////////////
/////////////
/// Operator overrides and supporting tools
///////////
//////////

bool operator== (Course &c1, Course &c2) {
    return (c1.id == c2.id);
}

bool operator!= (Course &c1, Course &c2) {
    return !(c1 == c2);
}

ostream& Course::getData(ostream &os) {
	os << getType() << ": ";
	os << id;
	os << " - ";
	os << title << " | ";
	if (professor.length() > 0 && professor != " ")
		os << professor;
	return os;
}

ostream &operator<<(ostream &os, Course &item) {
	return item.getData(os);
}


//////////////
/////////////
/// Methods of displaying the class
///////////
//////////

void Course::showAll() {
	cout << id << endl;
	cout << "Title: " << title << endl;
	cout << "Professor: " << professor << endl;
	cout << "Type: " << courseType << endl;
	cout << "Half-semester? " << half_semester << endl;
	cout << "Credits: " << credits << endl;
	cout << "Pass/Fail? " << pass_fail << endl;
	cout << "Location: " << location << endl;
	cout << endl;
}

void Course::display() { 
	cout << *this << endl; 
}


//////////////
/////////////
/// The all-important getCourse
///////////
//////////

Course getCourse(string identifier) {
//	cout << "called getCourse with '" << identifier << "'" << endl;
	ID id(identifier);
	// cout << id << endl;
	// TODO: Add lab support.

	for (vector<Course>::iterator i = all_courses.begin(); i != all_courses.end(); ++i)
		if (i->id == id)
			return *i;

	// If no match, return a blank course.
	Course c;
	return c;
}
