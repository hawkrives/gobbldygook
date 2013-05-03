#ifndef __Color__
#define __Color__

#include <iostream>
using namespace std;

class Color {
public:
	double red, green, blue;
	Color();
	Color(double single);
	Color(double r, double g, double b);
	Color(const Color &c);
	void display();
	Color &operator= (const Color &c);
};

ostream &operator<<(ostream &os, Color c);

#endif