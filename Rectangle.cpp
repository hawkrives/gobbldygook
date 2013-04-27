#include "Rectangle.h"

Rectangle::Rectangle() {
	width = 640;
	height = 480;
}
Rectangle::Rectangle(const Rectangle &c) {
	x1 = c.x1; x2 = c.x2;
	y1 = c.y1; y2 = c.y2;
	width = c.width;
	height = c.height;
	color = c.color;
}
Rectangle::Rectangle(double newX, double newY, double w, double h) {
	x1 = newX;
	y1 = newY;
	width = w;
	height = h;
	x2 = x1 + width;
	y2 = y1 + height;
}
Rectangle::Rectangle(double newX, double newY, double w, double h, Color newColor) {
	x1 = newX;
	y1 = newY;
	width = w;
	height = h;
	x2 = x1 + width;
	y2 = y1 + height;
	color = newColor;
}

Rectangle& Rectangle::operator= (const Rectangle &c) {
	if (this == &c)
        return *this;

 	delete &color;
	x1 = c.x1; x2 = c.x2;
	y1 = c.y1; y2 = c.y2;
	width = c.width;
	height = c.height;
	color = c.color;

    return *this;
}

void Rectangle::set_width(double w) {
	width = w;
}
void Rectangle::set_height(double h) {
	height = h;
}

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
