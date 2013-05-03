#include <fstream>
#include <iostream>
#include "data.hpp"
using namespace std;
#include "templates.h"

int main() {
  ifstream g("courses-s2-1213.csv");
  vector<Course> courses;
  while (!g.eof()) {
    Course incourse(g)
    courses.push_back(incourse);}
  for_each (courses.begin(), courses.end(), spit);
}
