#ifndef __lab8__Rectangle__
#define __lab8__Rectangle__

#ifdef MACOSX
#include <GLUT/glut.h>
#else
#include <GL/glut.h>
#endif
#include "Color.h"

class Rectangle {
	double x1, y1, x2, y2;
	double width, height;
	Color color;

public:
	Rectangle();
	Rectangle(double newX, double newY, double w, double h);
	Rectangle(double newX, double newY, double w, double h, Color newColor);
	Rectangle(const Rectangle &c);
	Rectangle &operator= (const Rectangle &c);
	
	void set_width(double w);
	void set_height(double h);
	
	bool hover();
	void draw();
};

#endif /* defined(__lab8__Rectangle__) */
