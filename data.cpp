#include <fstream>
#include <iostream>
#include "data.hpp"
using namespace std;

int main() {
	ifstream g("courses-s2-1213.csv");
	std::vector<Course> courses;
	while (!g.eof()) {
		Course tmpCourse(g);
		courses.push_back(tmpCourse);
	}
}