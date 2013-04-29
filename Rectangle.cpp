#include "Rectangle.h"

Rectangle::Rectangle() {
	width = 640;
	height = 480;
}
Rectangle::Rectangle(double x, double y, double w, double h) {
	init(x, y, w, h, Color(0));
}
Rectangle::Rectangle(double x, double y, double w, double h, Color c) {
	init(x, y, w, h, c);
}
Rectangle::Rectangle(const Rectangle &c) {
	init(c.x1, c.x2, c.width, c.height, c.color);
}
void Rectangle::init(double x, double y, double w, double h, Color c) {
	width = w; height = h;
	x1 = x; x2 = x1 + width;
	y1 = y; y2 = y1 + height;
	color = c;
}
Rectangle& Rectangle::operator= (const Rectangle &c) {
	if (this == &c)
        return *this;

 	delete &color;
	init(c.x1, c.x2, c.width, c.height, c.color);

    return *this;
}

void Rectangle::setX(double x) {
	x1 = x;
	x2 = x1 + width;
}
void Rectangle::setY(double y) {
	y1 = y; 
	y2 = y1 + height;
}
void Rectangle::setWidth(double w) {
	width = w;
	x2 = x1 + width;
}
void Rectangle::setHeight(double h) {
	height = h;
	y2 = y1 + height;
}
void Rectangle::setColor(Color c) {
	color = c;
}

double Rectangle::getX() { return x1; }
double Rectangle::getY() { return y1; }
double Rectangle::getWidth() { return width; }
double Rectangle::getHeight() { return height; }

bool Rectangle::hover(double x, double y) {
	return x >= x1 && y >= y1 &&
           x <= x1 + x2 &&
           y <= y1 + y2;
}

void Rectangle::draw() {
	glColor3f(color.red, color.green, color.blue);
	// sendGLColor();
	glBegin(GL_POLYGON);
		glVertex2f(x1, y1);  // upper left
		glVertex2f(x1, y2);  // lower left
		glVertex2f(x2, y2);  // lower right
		glVertex2f(x2, y1);  // upper right
	glEnd();
}
