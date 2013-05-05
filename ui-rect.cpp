#include "ui-rect.hpp"

UIRect::UIRect(double x, double y, double w, double h, string text) {
	UIRect::init(x, y, w, h, text);
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
	active = false; over = false;
	width = w; height = h;
	x1 = x; x2 = x1 + width;
	y1 = y; y2 = y1 + height;

	labelAlignment = 0;
	label = Label(x1+2, y2-(y2-y1-7.5)/2, text, Color(1, 0, 0));

	backgroundColor = Color(1);
	borderColor = Color(.4, .4, .4);

	borderThickness = 5;
	createBorder(borderThickness, borderColor);

	background = Rectangle(x1, y1, width, height, backgroundColor);
	background.setColor(backgroundColor);
}

void UIRect::copy(const UIRect &c) {
	init(c.x1, c.y1, c.width, c.height, c.label.contents);
	active = c.active; over = c.over;
	backgroundColor = c.backgroundColor;
	borderColor = c.borderColor;
	background = c.background;
	border = c.border;
	borderThickness = c.borderThickness;
}

void UIRect::createBorder(double thickness, Color color) {
	border = Rectangle(
		x1 - thickness,
		y1 - thickness,
		width + (thickness * 2),
		height + (thickness * 2),
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
	borderThickness = w;
	border.setX(background.getX() - borderThickness);
	border.setWidth(background.getWidth() + (borderThickness * 2));
	border.setY(background.getY() - borderThickness);
	border.setHeight(background.getHeight() + (borderThickness * 2));
}

void UIRect::setBorderColor(Color c) {
	borderColor = c;
	border.setColor(borderColor);
}
void UIRect::setBackgroundColor(Color c) {
	backgroundColor = c;
	background.setColor(backgroundColor);
}

void UIRect::setBorderColor(double c) {
	setBorderColor(Color(c));
}
void UIRect::setBackgroundColor(double c) {
	setBackgroundColor(Color(c));
}

void UIRect::setBorderColor(double r, double g, double b) {
	setBorderColor(Color(r, g, b));
}
void UIRect::setBackgroundColor(double r, double g, double b) {
	setBackgroundColor(Color(r, g, b));
}

void UIRect::setX1(double x) {
	x1 = x;
	width = x2 - x1;
}
void UIRect::setY1(double y) {
	y1 = y;
	height = y2 - y1;
}
void UIRect::setWidth(double w) { 
	width = w;
	x2 = x1 + width; 
}
void UIRect::setHeight(double h) { 
	height = h;
	y2 = y1 + height; 
}

void UIRect::setAlignment(int place) {
	if (place == 0 || place == 1 || place == 2)
		labelAlignment = place;
	else
		return;
}

bool UIRect::hover(int x, int y) {
	return x >= x1 && y >= y1 &&
	       x <= x2 && y <= y2;
}

void UIRect::draw() {
	if (over) {
		setBackgroundColor(.9);
	} else if (active) {
		setBackgroundColor(.9);
		setBorderColor(1.);
	} else {
		setBackgroundColor(1.);
		setBorderColor(.4);
	}

	if (borderThickness)
		border.draw();
	background.draw();
	label.draw();
}
