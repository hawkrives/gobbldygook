#include "id.hpp"

void ID::initiate(Department d, int n, string s) {
	departments.push_back(d);
	number = n;
	section = s;
}

ID::ID() {
	initiate(Department(), 0, "");
}

ID::ID(Department d, int n, string s) {
	initiate(d, n, s);
}

ID::ID(string str) {
	string d, d1, d2, n, s;
	int num;
	long firstSpace, firstDigit, lastDigit, lastChar;

	// Make sure everything is uppercase
	std::transform(str.begin(), str.end(), str.begin(), ::toupper);

	// Remove extraneous spaces
	if (str.at(0) == ' ')
		str.erase(0, 1);
	if (str.at(str.length()-1) == ' ')
		str = str.substr(0, str.length()-1);
	
	firstSpace = str.find_first_of(" ");

	firstDigit = str.find_first_of("0123456789");
	lastDigit  = str.find_last_of("0123456789");

	lastChar   = str.find_last_of("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

	// Split into Department, Number, and Section

	// pull out the department string
	if (firstSpace == string::npos) // if there is no space
		d = str.substr(0, firstDigit);
	else
		d = str.substr(0, firstSpace); // there is a space

	// check for one of those dastardly split departments
	if (d.find('/') != string::npos) {
		d1 = d.substr(0,2);
		d2 = d.substr(3,2);
	}
	
	n = str.substr(firstDigit, str.length());

	if (!isdigit(n[n.length()-1]))
		n = str.substr(firstDigit, n.length()-1);

	num = stringToInt(n);

	if (lastChar > lastDigit) // there is a section
		s = str[lastChar];
	
	initiate(Department(d), num, s);

	if (!d1.empty() && !d2.empty()) {
		departments.clear();
		departments.push_back(Department(d1));
		departments.push_back(Department(d2));
	}
}

Department ID::getDepartment(int i = 0) {
	return departments.at(i);
}

int ID::getNumber() {
	return number;
}

string ID::getSection() {
	return section;
}

ostream& ID::getData(ostream& os) {
	for (vector<Department>::iterator i = departments.begin(); i != departments.end(); ++i) {
		if (departments.size() == 1)
			os << i->getName();
		else {
			os << i->getName();
			if (i != departments.end()-1)
				os << "/";
		}
	}
	os << " ";
	os << number;
	if (!section.empty())
		os << "[" << section << "]";
	return os;
}

ostream& operator<<(ostream& os, ID& item) {
	return item.getData(os);
}

void ID::display() {
	cout << *this << endl;
}
