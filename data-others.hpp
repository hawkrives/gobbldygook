//data-others.hpp
#include "data-general.hpp"

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

ostream &operator<<(ostream &os, Course &item) { return item.getData(os); }
void Course::display() { if(this==0) cout << *this << endl; }

void spit(Course n) {
	n.display();
}
