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

	string activeHeading;
	for (vector<string>::iterator i = record.begin(); i != record.end(); ++i) {
		string str = *i, leftSide, rightSide;
		int found;
		if (activeHeading.empty())
			activeHeading = "NAME";
		found = str.find_first_of("#");
		if (found == 0) {
			std::transform(str.begin(), str.end(), str.begin(), ::toupper);
			str = str.substr(found+1, str.size()-found);
			activeHeading = removeStartingText(str, " ");
			continue;
		}
		found = str.find_first_of("=");
		if (found == string::npos) {
			leftSide = str.substr(0, found);
			rightSide = str.substr(found+1, str.size()-found);
		}
		else if (str != "") {
			if (str.substr(0, 2) == "//") {
				// it's a comment
			}
			else if (activeHeading == "REQUIREMENTS") {
				if (str.at(0) == '#' && str.at(1) == '#')
					requirements.push_back(MajorRequirement(str));
			}
			else if (activeHeading == "SPECIAL") {
				if (str.at(0) == '#' && str.at(1) == '#')
					specialRequirements.push_back(SpecialRequirement(str));
			}
			else if (activeHeading == "SETS") {
				if (str.at(0) == '#' && str.at(1) == '#')
					getSpecialRequirement(specialRequirements, str)->validSets.push_back(MajorRequirement(str));
			}
		}
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

MajorRequirement* Major::getMajorRequirement(vector<MajorRequirement> reqs, string name) {
	cout << "called getSpecialRequirement with '" << name << "'" << endl;
	
	for (vector<MajorRequirement>::iterator i = reqs.begin(); i != reqs.end(); ++i) {
		if (i->getName() == name)
			return &*i;
	}
	
	return 0;
}

SpecialRequirement* Major::getSpecialRequirement(vector<SpecialRequirement> reqs, string name) {
	cout << "called getSpecialRequirement with '" << name << "'" << endl;
	
	for (vector<SpecialRequirement>::iterator i = reqs.begin(); i != reqs.end(); ++i) {
		if (i->getName() == name)
			return &*i;
	}
	
	return 0;
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
