#include "data-major.hpp"
using namespace std;

Major::Major() {
	cout << "Called Major constructor with nothing." << endl;
	name = "None";
	department = Department("NONE");
}

Major::Major(string str) {
	// TODO: Allow lookup of majors by full name.
	// This means that I'll need to expose the data in Department in some way.
	// cout << "Called Major constructor with string '" << str << "'" << endl;
	string s = removeStartingText(str, " ");
	std::transform(s.begin(), s.end(), s.begin(), ::toupper);
	department = Department(str);
	name = department.getFullName();
}

Major::Major(const Major &c) {
	copy(c);
}

Major& Major::operator= (const Major &c) {
	if (this == &c) return *this;
	copy(c);
	return *this;
}

void Major::copy(const Major &c) {
	name = c.name;
	department = c.department;
	requirements = c.requirements;
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
