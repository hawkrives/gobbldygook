#include "concentration.hpp"

Concentration::Concentration() : Major() {
	cout << "Called Concentration constructor with nothing." << endl;
}

Concentration::Concentration(string s) : Major() {
	// cout << "Called Concentration constructor with string '" << str << "'" << endl;
	string str = removeStartingText(s, " ");
	department = Department(str);
	name = department.getFullName();
	
	string contentsOfFile = getFileContents("concentrations/" + department.getName() + ".txt");
	vector<string> record = split(contentsOfFile, '\n');
	
	Major::init(record);
	
	name = department.getFullName();
	record.clear();
}

Concentration::Concentration(const Concentration &c) {
	copy(c);
}

Concentration& Concentration::operator= (const Concentration &c) {
	if (this == &c) return *this;
	copy(c);
	return *this;
}

ostream& Concentration::getData(ostream &os) {
	os << name;
	return os;
}

ostream &operator<<(ostream &os, Concentration &item) {
	return item.getData(os);
}

void Concentration::display() {
	cout << *this << endl;
}
