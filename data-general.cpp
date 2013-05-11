#include "data-general.hpp"
using namespace std;

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
