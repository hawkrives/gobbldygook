#import "ui.h"

class Button {
protected:
	double x1, y1, x2, y2;
	double width, height;
	double borderWidth;
	string text;

	Rectangle background, border;

public:
	Button(double newX, newY, newX2, newY2, string contents, double borderWidth=0) {
		x1 = newX;  y1 = newY;
		x2 = newX2; y2 = newY2;
		
		width = x2 - x1;
		height = y2 - y1;

		background = new Rectangle(x1, y1, width, height);
		if (borderWidth) {
			border = new Rectangle(
				x1-borderWidth, 
				y1-borderWidth, 
				width+(borderWidth*2)
				height+(borderWidth*2)
			)
		}

		text = contents;
	}
	~Button();

	bool hover(int x, int y) {
		return x >= x1  && y >= y1 &&
	           x <= x1 + x2 &&
	           y <= y1 + y2;
	}

	void draw() {
		glBegin(GL_POLYGON);
			glVertex2f(x1, y1);  // upper left
			glVertex2f(x1, y2);  // lower left
			glVertex2f(x2, y2);  // lower right
			glVertex2f(x2, y1);  // upper right
		glEnd();
	}

	/* data */
};