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

		buttonColor = new Color(127, 127, 127);
		borderColor = new Color(90, 90, 90);

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
	~Button();

	bool hover(int x, int y) {
		return x >= x1 && y >= y1 &&
	           x <= x1 + x2 &&
	           y <= y1 + y2;
	}

	bool click() {

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

	/* data */
};