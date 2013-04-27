#include "ui.h"

class TextBox{
protected:
  double x1, y1, x2, y2;
  double width, height;
  double borderWidth;
  string textInBox;
  Rectangle background, border;
public:
  TextBox(double newX1, double newY1, double newX2, double newY2, string text, double borderWidth = 0) {
    x1 = newX1; y1 = newY1;
    x2 = newX2; y2 = newY2;
    width = x2 - x1;
    height = y2 - y1;
    textInBox = text;
    background = new Rectangle(x1, y1, width, height);
    if (borderWidth) {
      border = new Rectangle(
	 x1-borderWidth,
	 y1-borderWidth,
	 width + 2*borderWidth;
	 height + 2*borderWidth;)
	}
  }
  bool hover(double x, double y) {
    return x >= x1 && y >= y1 &&
      x <= x1 + x2 && y <= y1 + y2;
  }

  void draw() {
    if (borderWidth) {border.draw();}
    background.draw();
}

  void drawText() {
    glRasterPos2f( x1+5, y1 + (y1+y2-15)/2 );
    for (int i = 0; i < textInBox.length; i++)
      glutBitmapCharacter(GLUT_BITMAP_9_BY_15, textInBox[i]);
}


}
