#include "data-id.hpp"

ID::ID() {
	init(Department(), 0, "");
}
ID::ID(const ID& c) {
	copy(c);
}
ID& ID::operator= (const ID &c) {
	if (this == &c) return *this;
	copy(c);
	return *this;
}

ID::ID(string str) {
	string d, d1, d2, n, s;
	int num;
	long firstSpace, firstDigit, lastDigit, lastChar;
	// cout << "Parsed '" << str << "' to get '";
	// cout << "Called ID::ID() with string '" << str << "'" << endl;

	// Make sure everything is uppercase
	std::transform(str.begin(), str.end(), str.begin(), ::toupper);

	// Remove extraneous spaces
	if (str.at(0) == ' ')
		str.erase(0, 1);
	if (str.at(str.length()-1) == ' ')
		str = str.substr(0, str.length()-1);
	
	firstSpace = str.find_first_of(" ");

	firstDigit = str.find_first_of("0123456789");
	lastDigit  =  str.find_last_of("0123456789");

	lastChar   =  str.find_last_of("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

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

	// cout << "Parsed '" << str << "' to get '";
	// cout << d << " ";
	// if (!d1.empty() && !d2.empty())
		// cout << "(" << d1 << " " << d2 << ") ";
	// cout << n << s << "'." << endl;
	
	init(Department(d), num, s);
	if (!d1.empty() && !d2.empty()) {
		departments.clear();
		departments.push_back(Department(d1));
		departments.push_back(Department(d2));
	}
	// cout << *this << endl;
}
ID::ID(string dn, string s) {
	ID(dn+s);
}
ID::ID(string d, string n, string s) {
	ID(d + n + s);
}
ID::ID(Department d, int n, string s) {
	init(d, n, s);
}

void ID::init(Department d, int n, string s) {
	departments.push_back(d);
	number = n;
	section = s;
}

void ID::copy(const ID& c) {
	departments = c.departments;
	number = c.number;
	section = c.section;
}

Department ID::getDepartment(int i = 0) {
	return departments.at(i);
}

const Department ID::getDepartment_const(int i = 0) {
	return departments.at(i);
}

int ID::getNumber() {
	return number;
}

string ID::getSection() {
	return section;
}

bool operator== (const ID &i1, const ID &i2) {
    return ((i1.departments[0] == i2.departments[0]) && (i1.number == i2.number) && (i1.section == i2.section));
}

bool operator!= (ID &i1, ID &i2) {
    return !(i1 == i2);
}

bool operator< (const ID &i1, const ID &i2) {
	return (i1.departments.at(0) < i2.departments.at(0));
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
