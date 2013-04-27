#include "Rectangle.h"

Rectangle::Rectangle() {
	width = 640;
	height = 480;
}
Rectangle::Rectangle(double newX, double newY, double w, double h) {
	x = newX;
	y = newY;
	width = w;
	height = h;
}
Rectangle::Rectangle(double newX, double newY, double w, double h, Color color) {
	x = newX;
	y = newY;
	width = w;
	height = h;
	color = Color;
}

void Rectangle::set_width(double w) {
	width = w;
}
void Rectangle::set_height(double h) {
	height = h;
}

bool hover(double x, double y) {
	return x >= x1 && y >= y1 &&
           x <= x1 + x2 &&
           y <= y1 + y2;
}

void Rectangle::draw() {
	glColor3f(color.red, color.green, color.blue);
	sendGLColor();
	glBegin(GL_POLYGON);
		glVertex2f(x1, y1);  // upper left
		glVertex2f(x1, y2);  // lower left
		glVertex2f(x2, y2);  // lower right
		glVertex2f(x2, y1);  // upper right
	glEnd();
}
