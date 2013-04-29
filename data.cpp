#include<fstream>
#include<iostream>
using namespace std;
#include "data.h"

int main() {
  ifstream g("courses-s2-1213.csv");
  vector<Course> courses;
  while (!g.eof()) {
    Course incourse(g)
    courses.push_back(incourse);
  }
