#include "ui-elements.h"

// UIRect::UIRect() {
// 	cout << "Inside UIRect's default constructor" << endl;
// 	UIRect::init(5, 5, 50, 20, "");
// 	setBorderWidth(2);
// }

UIRect::UIRect(double x, double y, double w, double h, string text) {
	cout << "Inside UIRect()" << endl;
	UIRect::init(x, y, w, h, text);
	// setBorderWidth(2);
}

UIRect::UIRect(const UIRect &c) {
	UIRect::copy(c);
}

UIRect& UIRect::operator= (const UIRect &c) {
	if (this == &c) return *this;
	copy(c);
    return *this;
}

void UIRect::init(double x, double y, double w, double h, string text) {
	cout<<"Inside UIRect::init("<<x<<", "<<y<<", "<<w<<", "<<h<<")"<<endl;
	active = false;
	width = w; height = h;
	x1 = x; x2 = x1 + width;
	y1 = y; y2 = y1 + height;
	cout<<"Inside UIRect Vars("<<x1<<", "<<y1<<", "<<x2<<", "<<y2<<", "<<width<<", "<<height<<")"<<endl;

	label = Label(x1+2, y2-(y2-y2-15)/2, text, Color(255, 0, 0));

	backgroundColor = Color(255);
	borderColor = Color(90, 90, 90);

	borderThickness = 5;
	createBorder(borderThickness, borderColor);

	cout << "+ Creating background (";
	cout << "x1:" << x1 << ", "; 
	cout << "y1:" << y1 << ", ";
	cout << "x2:" << x2 << ", "; 
	cout << "y2:" << y2 << ", ";
	cout << "w:" << width << ", ";
	cout << "h:" << height << ")" << endl;
	background = Rectangle(x1, y1, width, height, backgroundColor);
	background.setColor(backgroundColor);
	cout << "- Created background (";
	cout << "x1:" << background.x1 << ", "; 
	cout << "y1:" << background.y1 << ", ";
	cout << "x2:" << background.x2 << ", "; 
	cout << "y2:" << background.y2 << ", ";
	cout << "w:" << background.width << ", ";
	cout << "h:" << background.height << ")" << endl;

	border.setColor(borderColor);
}

void UIRect::copy(const UIRect &c) {
	cout << "Inside UIRect(const &c)" << endl;
	init(c.x1, c.y1, c.width, c.height, c.label.contents);
	active = c.active;
	backgroundColor = c.backgroundColor;
	borderColor = c.borderColor;
	background = c.background;
	border = c.border;
	borderThickness = c.borderThickness;
}

void UIRect::createBorder(double thickness, Color color) {
	cout << "+ Creating border, thickness " << thickness << endl;
	border = Rectangle(
		x1 - thickness,
		y1 - thickness,
		width + (thickness * 2),
		height + (thickness * 2),
		color);
	cout << "- Created border (";
	cout << "x1:" << border.x1 << ", "; 
	cout << "y1:" << border.y1 << ", ";
	cout << "x2:" << border.x2 << ", "; 
	cout << "y2:" << border.y2 << ", ";
	cout << "w:" << border.width << ", ";
	cout << "h:" << border.height << ")" << endl;
}

string UIRect::getLabel() {
	return label.contents;
}
void UIRect::setLabel(string text) {
	label.contents = text;
}

void UIRect::setBorderWidth(double w) {
	borderThickness = w;
	border.setX(background.getX() - borderThickness);
	border.setWidth(background.getWidth() + (borderThickness * 2));
	border.setY(background.getY() - borderThickness);
	border.setHeight(background.getHeight() + (borderThickness * 2));
}
void UIRect::setBorderColor(Color c) {
	borderColor = c;
	border.setColor(c);
}

void UIRect::setBackgroundColor(Color c) {
	backgroundColor = c;
	background.setColor(c);
}

void UIRect::setX1(double x) { x1 = x; }
void UIRect::setY1(double y) { y1 = y; }
void UIRect::setWidth(double w) { 
	width = w;
	x2 = x1 + width; 
}
void UIRect::setHeight(double h) { 
	height = h;
	y2 = y1 + height; 
}

bool UIRect::hover(int x, int y) {
	return x >= x1 && y >= y1 &&
	       x <= x1 + x2 &&
	       y <= y1 + y2;
}

void UIRect::draw() {
	// cout << "Inside UIRect::draw()" << endl;
	if (borderThickness)
		border.draw();
	background.draw();
	label.draw();
}
