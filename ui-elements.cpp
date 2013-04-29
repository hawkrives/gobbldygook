#include "ui-elements.h"

UIRect::UIRect() {
	UIRect::init(5, 5, 50, 20, "");
	setBorderWidth(5);
}

UIRect::UIRect(double x, double y, double w, double h, string text) {
	UIRect::init(x, y, w, h, text);
	setBorderWidth(5);
}

UIRect::UIRect(const UIRect &c) {
	UIRect::copy(c);
}

UIRect& UIRect::operator= (const UIRect &c) {
	if (this == &c)
		return *this;

	copy(c);

    return *this;
}

void UIRect::init(double x, double y, double w, double h, string text) {
	active = false;
	width = w; height = h;
	x1 = x; x2 = x1 + width;
	y2 = y; y2 = y1 + height;

	label = Label(x1, x2, text, Color(255, 0, 0));

	backgroundColor = Color(127);
	borderColor = Color(90);

	borderWidth = 0;
	createBorder(borderWidth, borderColor);
	background = Rectangle(x1, y1, width, height, backgroundColor);
}

void UIRect::copy(const UIRect &c) {
	init(c.x1, c.y1, c.width, c.height, c.label.contents);
	active = c.active;
	backgroundColor = c.backgroundColor;
	borderColor = c.borderColor;
	background = c.background;
	if (borderWidth)
		border = c.border;
}

void UIRect::createBorder(double size, Color color) {
	border = Rectangle(
		x1 - size, y1 - size,
		width + (size * 2), height + (size * 2),
		color
	);
}

string UIRect::getLabel() {
	return label.contents;
}
void UIRect::setLabel(string text) {
	label.contents = text;
}

void UIRect::setBorderWidth(double w) {
	borderWidth = w;
	border.setX(border.getX() - w);
	border.setWidth(border.getWidth() + (borderWidth * 2));
	border.setY(border.getY() - w);
	border.setHeight(border.getHeight() + (borderWidth * 2));
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
	if (borderWidth)
		border.draw();
	background.draw();
	label.draw();
}
