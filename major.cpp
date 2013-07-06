#include "major.hpp"

void Major::copy(const Major &c) {
	name = c.name;
	department = c.department;
	requirements = c.requirements;
	specialRequirements = c.specialRequirements;
}

Major::Major() {
	// cout << "Called Major constructor with nothing." << endl;
	name = "None";
	department = Department("NONE");
}

Major::Major(string s) {
	// cout << "Called Major constructor with string '" << str << "'" << endl;
	string str = removeStartingText(s, " ");
	department = Department(str);
	name = department.getFullName();

	string contentsOfFile = getFileContents("majors/" + department.getName() + ".txt");
	vector<string> record = split(contentsOfFile, '\n');

	parse(record);

	name = department.getFullName();
	record.clear();
}

void Major::parse(vector<string> record) {
	string activeHeading, activeRequirement;
	for (vector<string>::iterator i = record.begin(); i != record.end(); ++i) {
		string str = *i;
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
}

Major::Major(const Major &c) {
	copy(c);
}

Major& Major::operator= (const Major &c) {
	if (this == &c) return *this;
	copy(c);
	return *this;
}

MajorRequirement* Major::getMajorRequirement(string str) {
//	cout << "called getMajorRequirement with '" << str << "'" << endl;
	str = removeStartingText(str, " ");
	for (vector<MajorRequirement>::iterator i = requirements.begin(); i != requirements.end(); ++i)
		if (i->getName() == str)
			return &*i;
	return 0;
}

SpecialRequirement* Major::getSpecialRequirement(string str) {
//	cout << "called getSpecialRequirement with '" << str << "'" << endl;
	str = removeStartingText(str, " ");
	for (vector<SpecialRequirement>::iterator i = specialRequirements.begin(); i != specialRequirements.end(); ++i)
		if (i->getName() == str)
			return &*i;
	return 0;
}

MajorRequirement* Major::getSetRequirement(string str) {
//	cout << "called getSetRequirement with '" << str << "'" << endl;
	str = removeStartingText(str, " ");
	for (vector<MajorRequirement>::iterator i = setRequirements.begin(); i != setRequirements.end(); ++i)
		if (i->getName() == str)
			return &*i;
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
