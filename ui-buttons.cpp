#include "ui.h"

class Button {
protected:
	double x1, y1, x2, y2;
	double width, height;
	double borderWidth;
	string text;

	Color buttonColor, borderColor;
	Rectangle background, border;

public:
	bool active;
	Button(double newX, double newY, double newX2, double newY2, string contents, double borderWidth=0) {
		active = false;
		x1 = newX;  y1 = newY;
		x2 = newX2; y2 = newY2;
		
		width = x2 - x1;
		height = y2 - y1;

		buttonColor = new Color(127);
		borderColor = new Color(90);

		background = new Rectangle(x1, y1, width, height, buttonColor);
		if (borderWidth) {
			border = new Rectangle(
				x1-borderWidth, 
				y1-borderWidth, 
				width+(borderWidth*2),
				height+(borderWidth*2),
				borderColor
			)
		}
		text = contents;
	}
	Button (const Button &c) {
		active = c.active;
		x1 = c.x1; y1 = c.y1;
		x2 = c.x2; y2 = c.y2;
		
		width = c.width;
		height = c.height;

		buttonColor = c.buttonColor;
		borderColor = c.borderColor;

		background = c.background;
		if (borderWidth) border = c.border;
		text = c.text;
	}
	~Button() {
		delete buttonColor;
		delete borderColor;
		delete background;
		if (borderWidth) delete border;
	};

	Button& operator= (const Button &c) {
		if (this == &c)
	        return *this;

	    active = c.active;
		x1 = c.x1; y1 = c.y1;
		x2 = c.x2; y2 = c.y2;

		width = c.width;
		height = c.height;

		delete buttonColor;
		delete borderColor;
		buttonColor = c.buttonColor;
		borderColor = c.borderColor;

		delete background;
		background = c.background;
		if (borderWidth) {
			delete border;
			border = c.border;
		}
		text = c.text;

	    return *this;
	}

	bool hover(int x, int y) {
		return x >= x1 && y >= y1 &&
	           x <= x1 + x2 &&
	           y <= y1 + y2;
	}


	void draw() {
		if (borderWidth)
			border.draw();
		background.draw();
	}

	void drawText() {
		glRasterPos2f(x1+5, y1+(y1+y2-15)/2);
		for (int i = 0; i < text.length(); i++)
			glutBitmapCharacter(GLUT_BITMAP_9_BY_15, text[i]);
	}
};