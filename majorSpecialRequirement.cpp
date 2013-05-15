#include "data-majorSpecialRequirement.hpp"
using namespace std;

MajorSpecialRequirement::MajorSpecialRequirement() {
	init("", 0);
};

MajorSpecialRequirement::MajorSpecialRequirement(istream &is) {
	if (!is) return;
	
	string tmpLine;
	getline(is, tmpLine); // read in so we can do things with it.
	
	vector<string> record = split(tmpLine, ',');
	
	string nextLine;
	vector<string> lines;
	
	// load the entire file
	while (is.peek() != -1) {
		getline(infile, nextLine);
		lines.push_back(nextLine);
	}

	string previousHeading;
	for (vector<string>::iterator i = lines.begin(); i != lines.end(); ++i) {
		string str = *i;
		if (previousHeading.empty())
			previousHeading = "# NAME";
		if (str[0] == '#') {
			std::transform(str.begin(), str.end(), str.begin(), ::toupper);
			previousHeading = *i;
			continue;
		}
		else if (str != "") {
			if (str.substr(0, 2) == "//") {
				// it's a comment
			}
			else if (previousHeading == "# NAME")
				name = str;
			else if (previousHeading == "# MAJORS")
				addMajor(Major(str));
			else if (previousHeading == "# CONCENTRATIONS")
				addConcentration(Concentration(str));
			else if (previousHeading == "# COURSES")
				addCourse(Course(str));
			else if (previousHeading == "# LABS")
				addCourse(Course(str));
		}
	}
};

MajorSpecialRequirement::MajorSpecialRequirement(string fn) {
	string yearS, yearE;
	ifstream infile(fn.c_str());
	
	MajorSpecialRequirement(infile);
}

MajorSpecialRequirement::MajorSpecialRequirement(const MajorSpecialRequirement &c) {
	copy(c);
};

MajorSpecialRequirement MajorSpecialRequirement::operator= (const MajorSpecialRequirement &c) {
	if (this == &c) return *this;
	copy(c);
	return *this;
};

void MajorSpecialRequirement::init(string n, int need) {
	name = n;
	needed = need;
	has = 0;
	satisfied = false;
	validSets;
};

void MajorSpecialRequirement::copy(const MajorSpecialRequirement &c) {
	name = c.name;
	needed = c.needed;
	has = c.has;
	satisfied = c.satisfied;
	validSets = c.validSets;
};

bool MajorSpecialRequirement::fulfillsRequirement(const MajorRequirement& c) {
 	for (vector<MajorRequirement>::iterator i=validSets.begin(); i!=validSets.end(); ++i) {
 		if (*i==c)
 			return true;
 	}
 	return false;
}

void MajorSpecialRequirement::incrementHas() {
	++has;
	if (has >= needed)
	  satisfied = true;
	else
	  satisfied = false;
}

bool operator== (const MajorSpecialRequirement &msr1, const MajorSpecialRequirement &msr2) {
    return (msr1.name == msr2.name);
}

bool operator!= (MajorSpecialRequirement &msr1, MajorSpecialRequirement &msr2) {
    return !(msr1 == msr2);
}
