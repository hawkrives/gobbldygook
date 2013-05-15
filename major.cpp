#include "major.hpp"
using namespace std;

void Major::copy(const Major &c) {
	name = c.name;
	department = c.department;
	requirements = c.requirements;
	specialRequirements = c.specialRequirements;
}

Major::Major() {
	cout << "Called Major constructor with nothing." << endl;
	name = "None";
	department = Department("NONE");
}

Major::Major(string str) {
	// cout << "Called Major constructor with string '" << str << "'" << endl;
	string s = removeStartingText(str, " ");
	department = Department(str);
	name = department.getFullName();
	
	
	string contentsOfFile = getFileContents("majors/" + department.getName() + ".txt");
	vector<string> record = split(contentsOfFile, '\n');
	for (vector<string>::iterator i=record.begin(); i != record.end(); ++i) {
		cout << *i << endl;
	}
		
	record.clear();
}

Major::Major(const Major &c) {
	copy(c);
}

Major& Major::operator= (const Major &c) {
	if (this == &c) return *this;
	copy(c);
	return *this;
}



ostream& Major::getData(ostream &os) {
	os << name;
	return os;
}

ostream &operator<<(ostream &os, Major &item) { 
	return item.getData(os); 
}

void Major::display() {
	cout << *this << endl;
}
