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
	string currentHeading = "";
	string currentRequirement = "";

	for (string &line : record) {
		// Make sure that the string is uppercase
		std::transform(line.begin(), line.end(), line.begin(), ::toupper);

		if (line.empty()) {
			// Skip the rest of this iteration of the loop
			continue;
		}

		else if (checkIfHeading(&line)) {
			currentHeading = parseHeading(&line);
		}

		if (checkIfSubHeading(&line)) {
			currentRequirement = parseSubHeading(&line, &currentHeading);
		}

		checkIfComment(&line);

		parseContent(&line, &currentRequirement, &currentHeading);
	}
}



string Major::parseSubHeading(const string* str, const string* currentHeading) {
	if (checkIfSubHeading(str)) {
		// Remove the octothorps from the beginning of the requirement title
		string requirementTitle = str->substr(2, str->length()-2);

		// Remove any spaces from the beginning of the requirement title
		requirementTitle = removeStartingText(requirementTitle, " ");

		if (*currentHeading == "REQUIREMENTS") {
			MajorRequirement req = MajorRequirement(requirementTitle);
			requirements.push_back(req);
//			addMajorRequirement(req);
		}

		else if (*currentHeading == "SETS") {
			SpecialRequirement req = SpecialRequirement(requirementTitle);
			specialRequirements.push_back(req);
//			addSpecialRequirement(req);
		}

		else if (*currentHeading == "SPECIAL") {
			// um, why are these MajorRequirements?
			MajorRequirement req = MajorRequirement(requirementTitle);
			setRequirements.push_back(req);
//			addSetRequirement(req);
		}

		return requirementTitle;
	}

	else {
		cerr << "parseSubHeading returned nothing." << endl;
		cerr << "str: \"" << *str << "\"" << endl;
		cerr << "currentHeading: \"" << *currentHeading << "\"" << endl;
		return "";
	}
}

string Major::parseHeading(const string* str) {
	if (checkIfHeading(str) && !checkIfSubHeading(str)) {
		// We can assume that, if we are inside this block, there is only one octothorpe at the beginning of the line.
		string headingTitle = str->substr(1, str->size() - 1);

		return removeStartingText(headingTitle, " ");
	}
	else {
		cerr << "parseHeading returned nothing." << endl;
		cerr << "str: \"" << *str << "\"" << endl;
		return "";
	}
}

void Major::parseContent(const string *str, const string *currentRequirement, const string *currentHeading) {
	cout << "content: \"" << *str << "\"" << endl;
	if (checkIfContent(str)) {
		pair<string, string> sides = parseContentLine(str);
		cout << sides << endl;

		if (sides.first == "NAME")
			name = sides.second;
		else if (sides.first == "DEPARTMENT")
			department = Department(sides.second);
		else if (sides.first == "NEEDED") {
			if (*currentRequirement == "REQUIREMENTS")
				getMajorRequirement(*currentRequirement)->setNeeded(stoi(sides.second));
			else if (*currentRequirement == "SPECIAL")
				getSpecialRequirement(*currentRequirement)->setNeeded(stoi(sides.second));
			else if (*currentRequirement == "SETS")
				getSetRequirement(*currentRequirement)->setNeeded(stoi(sides.second));
		}

		else if (sides.first == "VALIDCOURSES") {
			vector<string> validCourseList = split(sides.second, ',');
			for (auto &courseID : validCourseList) {
				if (*currentHeading == "REQUIREMENTS")
					getMajorRequirement(*currentRequirement)->addCourse(ID(courseID));

				else if (*currentHeading == "SETS")
					getSetRequirement(*currentRequirement)->addCourse(ID(courseID));
			}
		}

		else if (sides.first == "VALIDSETS") {
			vector<string> validSetList = split(sides.second, ',');
			SpecialRequirement* sp = getSpecialRequirement(*currentRequirement);

			for (auto &setID : validSetList)
				sp->addSet(*getSetRequirement(setID));
		}
	}
}

pair<string, string> Major::parseContentLine(const string *str) {
	long firstEquals = str->find_first_of("=");
	string leftSide = str->substr(0, firstEquals-1);
	string rightSide = str->substr(firstEquals+2, str->size()-firstEquals);
	return {leftSide, rightSide};
}


#pragma mark Parsing checkers
// Parsing checkers

bool Major::checkIfComment(const string* str) {
	if (str->substr(0, 2) == "//")
		return true;
	else
		return false;
}

bool Major::checkIfHeading(const string *str) {
	if (str[0] == "#")
		return true;
	else
		return false;
}

bool Major::checkIfSubHeading(const string *str) {
	if (str->substr(0, 2) == "##")
		return true;
	else
		return false;
}

bool Major::checkIfContent(const string *str) {
	return (str->find_first_of("=") != string::npos);
}


#pragma mark Setters
// Setters

void Major::addMajorRequirement(MajorRequirement req) {
	requirements.push_back(req);
}
void Major::addSpecialRequirement(SpecialRequirement req) {
	specialRequirements.push_back(req);
}
void Major::addSetRequirement(MajorRequirement req) {
	setRequirements.push_back(req);
}


#pragma mark Getters
// Getters

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


#pragma mark Output Methods
// Output Methods

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
