#include "concentration.hpp"
using namespace std;

Concentration::Concentration() : Major() {
	cout << "Called Concentration constructor with nothing." << endl;
}

Concentration::Concentration(string s) : Major() {
	// cout << "Called Major constructor with string '" << str << "'" << endl;
	string str = removeStartingText(s, " ");
	department = Department(str);
	name = department.getFullName();
	
	string contentsOfFile = getFileContents("concentrations/" + department.getName() + ".txt");
	vector<string> record = split(contentsOfFile, '\n');
	
	string activeHeading, activeRequirement;
	for (vector<string>::iterator i = record.begin(); i != record.end(); ++i) {
		str = *i;
		std::transform(str.begin(), str.end(), str.begin(), ::toupper);
		string leftSide, rightSide;
		long found;
		if (activeHeading.empty())
			activeHeading = "NAME";
		found = str.find_first_of("#");
		if (found == 0 && (str.substr(0, 2) != "##")) {
			str = str.substr(found+1, str.size()-found);
			activeHeading = removeStartingText(str, " ");
			continue;
		}
		if (activeHeading == "SPECIAL") {
			
		};
		found = str.find_first_of("=");
		if (found != string::npos) {
			leftSide = str.substr(0, found-1);
			rightSide = str.substr(found+2, str.size()-found);
			if (leftSide == "NAME")
				name = rightSide;
			else if (leftSide == "DEPARTMENT")
				department = Department(rightSide);
			else if (leftSide == "NEEDED") {
				int x = stringToInt(rightSide);
				if (activeHeading == "REQUIREMENTS")
					getMajorRequirement(activeRequirement)->setNeeded(x);
				else if (activeHeading == "SPECIAL")
					getSpecialRequirement(activeRequirement)->setNeeded(x);
				else if (activeHeading == "SETS")
					getSetRequirement(activeRequirement)->setNeeded(x);
			}
			
			else if (leftSide == "VALIDCOURSES") {
				vector<string> validCourseList = split(rightSide, ',');
				for (vector<string>::iterator idx = validCourseList.begin(); idx != validCourseList.end(); ++idx) {
					if (activeHeading == "REQUIREMENTS") {
						MajorRequirement* mr = getMajorRequirement(activeRequirement);
						mr->addCourse(ID(*idx));
					}
					else if (activeHeading == "SETS") {
						MajorRequirement* mr = getSetRequirement(activeRequirement);
						mr->addCourse(ID(*idx));
					}
				}
			}
			
			else if (leftSide == "VALIDSETS") {
				SpecialRequirement* sp = getSpecialRequirement(activeRequirement);
				vector<string> validSetList = split(rightSide, ',');
				for (vector<string>::iterator idx = validSetList.begin(); idx != validSetList.end(); ++idx)
					sp->addSet(*getSetRequirement(*idx));
			}
		}
		else if (str != "") {
			if (str.substr(0, 2) == "//") {
				// it's a comment
			}
			else if (str.substr(0, 2) == "##") {
				str = str.substr(2, str.length()-2);
				str = removeStartingText(str, " ");
				if (activeHeading == "REQUIREMENTS") {
					MajorRequirement m = MajorRequirement(str);
					requirements.push_back(m);
					activeRequirement = str;
				}
				else if (activeHeading == "SETS") {
					MajorRequirement m = MajorRequirement(str);
					setRequirements.push_back(m);
					activeRequirement = str;
				}
				else if (activeHeading == "SPECIAL") {
					SpecialRequirement special = SpecialRequirement(str);
					specialRequirements.push_back(special);
					activeRequirement = str;
				}
			}
		}
	}
	
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
