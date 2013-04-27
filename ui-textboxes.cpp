#include "ui.h"

class TextBox{
protected:
  double x1, y1, x2, y2;
  double width, height;
  double borderWidth;
  string textInBox;
  Color buttonColor, borderColor;
  Rectangle background, border;
  static int MAX_NUM_CHARS_IN_TEXTBOX = 20;
public:
  bool active;
  TextBox(double newX1, double newY1, double newX2, double newY2, string text, double borderWidth = 0) {
    x1 = newX1; y1 = newY1;
    x2 = newX2; y2 = newY2;
    width = x2 - x1;
    height = y2 - y1;
    textInBox = text;
    buttonColor = new Color(127, 127, 127);
    borderColor = new Color(90, 90, 90);
    background = new Rectangle(x1, y1, width, height, buttonColor);
    if (borderWidth) {
      border = new Rectangle(
	 x1-borderWidth,
	 y1-borderWidth,
	 width + 2*borderWidth,
	 height + 2*borderWidth,
	 borderColor)
	}
    active = false;
  }
  ~TextBox() {
    delete buttonColor;
    delete borderColor;
    delete background;
    if (borderWidth) {delete border;}
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


void keyboard( unsigned char c, int x, int y )
{
  if ( hover ) { // intercept keyboard press, to place in text box
    if ( 27==c ) exitAll();  // escape terminates the program, even in textbox
    if ( 13==c ) {
      cout << "textBox content was: " << textInBox << endl;
    } else if ( '\b'==c || 127==c ) { // handle backspace
      if ( textInBox.length() > 0 ) textInBox.erase(textInBox.end()-1);
    } else if ( c >= 32 && c <= 126 ) { // check for printable character
      // check that we don't overflow the box
      if ( textInBox.length() < MAX_NUM_CHARS_IN_TEXTBOX ) textInBox += c;
    }
  } else {
    switch(c) {
      case 'q':
      case 'Q':
      case 27:
        exitAll();
        break;
      default:
        break;
    }
  }
  glutPostRedisplay();
}


}
