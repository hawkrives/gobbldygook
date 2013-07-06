#include "concentration.hpp"

Concentration::Concentration(string s) : Major() {
	// cout << "Called Concentration constructor with string '" << str << "'" << endl;
	string str = removeStartingText(s, " ");
	department = Department(str);
	name = department.getFullName();
	
	string contentsOfFile = getFileContents("concentrations/" + department.getName() + ".txt");
	vector<string> record = split(contentsOfFile, '\n');
	
	Major::parse(record);
	
	name = department.getFullName();
	record.clear();
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
