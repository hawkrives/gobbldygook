#ifndef __Data_general__
#define __Data_general__

#include <iostream>
#include <sstream>
#include <fstream>
#include <vector>
#include <algorithm>    // has the for_each

using namespace std;

enum GenEd {
	// Foundation Studies
	FYW,   // First-Year Writing 
	WRI,   // Writing in Context
	FOL,   // Foreign Language
	ORC,   // Oral Communication
	AQR,   // Abstract and Quantitative Reasoning
	SPM,   // Studies in Physical Movement

	// Core Studies
	HWC,   // Historical Studies in Western Culture
	MCD,   // Multicultural Studies: Domestic
	MCG,   // Multicultural Studies: Global
	ALSA,  // Artistic and Literary Studies: Artistic Studies
	ALSL,  // Artistic and Literary Studies: Literary Studies
	BTSB,  // Biblical and Theological Studies: Bible
	BTST,  // Biblical and Theological Studies: Theology
	SED,   // Studies in Natural Science: Scientific Exploration and Discovery
	IST,   // Studies in Natural Science: Integrated Scientific Topics
	HBS,   // Studies in Human Behavior and Society

	// Integrative Studies
	EIN    // Ethical Issues and Normative Perspectives
};

enum dept_t {
	AFAM,  //0 Africa and the Americas
	ALSO,  //1 Alternate Language Study Option
	AMCON, //2 American Conversation
	AMST,  //3 American Studies
	ARMS,  //4 American Racial and Multicultural Studies
	ART,   //5 Art and Art History
	ASIAN, //6 Asian Studies (AS)
	BIO,   //7 Biology (BI)
	BMOLS, //8 Biomolecular Science
	CHEM,  //9 Chemistry (CH)
	CHIN,  //10 Chinese
	CLASS, //11 Classics
	CSCI,  //12 Computer Science
	DANCE, //13 Dance
	ECON,  //14 Economics
	EDUC,  //15 Education
	ENGL,  //16 English
	ENVST, //17 Environmental Studies (ES)
	ESAC,  //18 Exercise Science Activity
	ESTH,  //19 Exercise Science Theory
	FAMST, //20 Family Studies
	FILM,  //21 Film Studies
	FREN,  //22 French
	GCON,  //23 Great Conversation
	GERM,  //24 German
	GREEK, //25 Greek
	HIST,  //26 History (HI)
	HSPST, //27 Hispanic Studies
	// Note: INTER used to be ID, but there was a system conflict.
	IDFA,  //28  
	INTD,  //29 Interdepartmental
	INTER, //30 Interdisciplinary
	IS,    //31 Integrative Studies
	JAPAN, //32 Japanese
	LATIN, //33 Latin
	MATH,  //34 Mathematics
	MEDIA, //35 Media Studies
	MEDVL, //36 Medieval Studies
	MGMT,  //37 Management Studies
	MUSIC, //38 Music
	MUSPF, //39 Music Performance
	NEURO, //40 Neuroscience
	NORW,  //41 Norwegian
	NURS,  //42 Nursing
	PHIL,  //43 Philosphy
	PHYS,  //44 Physics
	PSCI,  //45 Political Science
	PSYCH, //46 Psychology
	REL,   //47 Religion (RE)
	RUSSN, //48 Russian
	SCICN, //49 Science Conversation
	SOAN,  //50 Sociology and Anthropology
	SPAN,  //51 Spanish
	STAT,  //52 Statistics
	SWRK,  //53 Social Work
	THEAT, //54 Theater
	WMGST, //55 Women's & Gender Studies
	WRIT,  //56 Writing
	NONE,
};


string tostring(int i) {
	ostringstream tmp;
	tmp << i;
	return tmp.str();
}

int stringToInt(string const& str) {
	istringstream i(str);
	int x;
	i >> x;
	return x;
}

float stringToFloat(string const& str) {
	istringstream i(str);
	float x;
	i >> x;
	return x;
}

vector<string> &split(const string &s, char delim, vector<string> &elems) {
	stringstream ss(s);
	string item;
	while (getline(ss, item, delim)) {
		elems.push_back(item);
	}
	return elems;
}

vector<string> split(const string &s, char delim) {
	// taken from http://stackoverflow.com/a/236803
	vector<string> elems;
	split(s, delim, elems);
	return elems;
}

string removeAllQuotes(string s) {
	s.erase(remove(s.begin(), s.end(), '\"'), s.end());
	return s;
}
string removeTrailingSlashes(string s) {
	if (s[s.length()-1] == '/')
		s.erase(s.length()-1, s.length());
	return s;
}
string removeTrailingText(string s, string toRemove) {
	if (s.find(toRemove) != s.npos)
		s.erase(s.find(toRemove));
	return s;
}
string removeStartingText(string s, string toRemove) {
	if (s.find(toRemove) != s.npos)
		s.erase(s.find_first_of(toRemove), s.find_first_of(toRemove)+toRemove.length());
	return s;
}

string deDoubleString(string s) {
	// Todo: write this.
	return s;
}

#endif
