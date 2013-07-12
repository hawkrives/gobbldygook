#include "major.hpp"

Major::Major(string s) {
	string str = removeStartingText(s, " ");
	department = Department(str);
	name = department.getFullName();

	string contentsOfFile = getFileContents("majors/" + department.getName() + ".txt");
	vector<string> record = split(contentsOfFile, '\n');

	parse(record);

	name = department.getFullName();
}

void Major::parse(vector<string> record) {
	string activeHeading, activeRequirement;
	for (string str : record) {
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
			// why was this blank?
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
//		else if (str != "") {
		else if (!str.empty()) {
			if (str.substr(0, 2) == "//") {
				// it's a comment
			}
			else if (str.substr(0, 2) == "##") {
				str = str.substr(2, str.length()-2);
				str = removeStartingText(str, " ");
				if (activeHeading == "REQUIREMENTS") {
					requirements.push_back(MajorRequirement(str));
					activeRequirement = str;
				}
				else if (activeHeading == "SETS") {
					setRequirements.push_back(MajorRequirement(str));
					activeRequirement = str;
				}
				else if (activeHeading == "SPECIAL") {
					specialRequirements.push_back(SpecialRequirement(str));
					activeRequirement = str;
				}
			}
		}
	}
}

MajorRequirement* Major::getMajorRequirement(string str) {
	str = removeStartingText(str, " ");
	for (int i = 0; i < requirements.size(); i++)
		if (requirements[i].getName() == str)
			return &requirements[i];
	return nullptr;
}

SpecialRequirement* Major::getSpecialRequirement(string str) {
	str = removeStartingText(str, " ");
	for (int i = 0; i < specialRequirements.size(); i++)
		if (specialRequirements[i].getName() == str)
			return &specialRequirements[i];
	return nullptr;
}

MajorRequirement* Major::getSetRequirement(string str) {
	str = removeStartingText(str, " ");
	for (int i = 0; i < setRequirements.size(); i++)
		if (setRequirements[i].getName() == str)
			return &setRequirements[i];
	return nullptr;
}


vector<MajorRequirement>* Major::getRequirements() {
	return &requirements;
}

vector<SpecialRequirement>* Major::getSpecialRequirements() {
	return &specialRequirements;
}

vector<MajorRequirement>* Major::getSetRequirements() {
	return &setRequirements;
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
