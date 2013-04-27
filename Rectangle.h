#ifndef __lab8__Rectangle__
#define __lab8__Rectangle__

#include <iostream>
using namespace std;
#include "Shape.h"

class Rectangle : public Shape {
	double x1, y1, x2, y2;
	double width, height;
	Color color;

public:
	Rectangle();
	Rectangle(int newX, int newY, int w, int h);
	Rectangle(int newX, int newY, int w, int h, Color color);
	
	void set_width(int w);
	void set_height(int h);
	
	bool hover();
	void draw();
};

#endif /* defined(__lab8__Rectangle__) */
