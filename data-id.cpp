#include "data-id.hpp"

ID::ID() {
	init(Department(NONE), 0, "");
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
	cout << "Before cleanup: " << str << endl;

	// Make sure everything is uppercase
	std::transform(str.begin(), str.end(), str.begin(), ::toupper);

	// Remove extraneous spaces
	if (str[0] == ' ')
		str.erase(0, 1);
	if (str[str.length()-1] == ' ')
		str = str.substr(0, str.length()-2);
	
	long firstSpace = str.find_first_of(" ");
	
	long firstDigit = str.find_first_of("0123456789");
	long lastDigit  =  str.find_last_of("0123456789");
	
//	long firstChar  = str.find_first_of("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
	long lastChar   =  str.find_last_of("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

	// Split into Department, Number, and Section
	string d, n, s;

	// pull out the department string
	if (s[firstSpace] == string::npos)
		d = str.substr(0, firstDigit);
	else
		d = str.substr(0, firstSpace);
	
	string d1, d2;

	// check for one of those dastardly split departments
	if (str.find('/') != string::npos) {
		string d1 = d.substr(0,2);
		string d2 = d.substr(3,2);
	}

	if (!d1.empty() && !d2.empty())
		cout << d << endl;

	n = str.substr(firstDigit, lastDigit);
	int num = stringToInt(n);

	if (lastChar > lastDigit) // there is a section
		s = str[lastChar];

	cout << d << endl;
	cout << n << endl;
	cout << s << endl;
	// cout << "After cleanup: " << str << endl;

	init(Department(d), num, s);
	if (!d1.empty() && !d2.empty()) {
		departments.clear();
		departments.push_back(Department(d1));
		departments.push_back(Department(d2));
	}
}
ID::ID(string dn, string s) {
	ID(dn+s);
}
ID::ID(string d, string n, string s) {
	// convert into appropriate types
	// Check if it's one of those dastardly "split courses".
	
	Department dept;
	int num = 0;
	string sec = s;
	init(dept, num, sec);
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
	return departments[i];
}

int ID::getNumber() {
	return number;
}

string ID::getSection() {
	return section;
}

bool operator== (ID &i1, ID &i2) {
	bool dept = (i1.departments[0] == i2.departments[0]);
	bool num  = (i1.number == i2.number);
	bool sec  = (i1.section == i2.section);
    return (dept && num && sec);
}

bool operator!= (ID &i1, ID &i2) {
    return !(i1 == i2);
}

ostream& ID::getData(ostream& os) {
	for (vector<Department>::iterator i = departments.begin(); i != departments.end(); ++i)
		os << i->getName();
	os << number;
	os << section;
	return os;
}

ostream& operator<<(ostream& os, ID& item) {
	return item.getData(os);
}

void ID::display() {
	cout << *this << endl;
}
