using namespace std;
#include "ui.h"

int WIDTH = 600;  // width of the user window
int HEIGHT = 480;  // height of the user window
char programName[] = "scheduler";

// button info
vector<Button> buttons;
vector<TextBox> textboxes;
vector<Label> labels;


void drawWindow() {
	// clear the buffer
	glClear(GL_COLOR_BUFFER_BIT);

	// Add hover colors after Monday
	// if ( buttonIsPressed ) glColor3f(1., 0., 0.);  // make it red
	// else if ( overButton ) glColor3f(.75,.75,.75);  // light gray
	// else glColor3f(.5, .5, .5);  // gray
	// drawBox(buttonPos);
	for (vector<Button>::iterator i = buttons.begin(); i != buttons.end(); ++i)
	    i->draw();
  
	// draw the textbox
	// glColor3f(.25, .25, .25);  // dark gray
	// drawBox(textBox1);
	// if ( overTextBox ) glColor3f(1,1,1);  // white
	// else glColor3f(.75, .75, .75);  // light gray
	// drawBox(textBox2);
	// glColor3f(0, 0, 0);  // black
	// if (overTextBox) { // draw with a cursor
	// 	string withCursor(textInBox);
	// 	withCursor += '|';
	// 	drawText( textBox2[0]+5, textBox2[1]+textBox2[3]-10, withCursor.c_str() );
	// } else drawText( textBox2[0]+5, textBox2[1]+textBox2[3]-10, textInBox.c_str() );
	for (vector<TextBox>::iterator i = textboxes.begin(); i != textboxes.end(); ++i) {
    	i->draw();
	}
	for (vector<Label>::iterator i = labels.begin(); i != labels.end(); ++i) {
    	i->draw();
	}

	// tell the graphics card that we're done-- go ahead and draw!
	//   (technically, we are switching between two color buffers...)
	glutSwapBuffers();
}

// close the window and finish the program
void exitAll() {
  int win = glutGetWindow();
  glutDestroyWindow(win);
  exit(0);
}

// process keyboard events
void keyboard( unsigned char c, int x, int y ) {
	for (std::vector<TextBox>::iterator i = textboxes.begin(); i != textboxes.end(); ++i) {
		if ( i->hover() ) { // intercept keyboard press, to place in text box
		    if ( 27==c ) exitAll();  // escape terminates the program, even in textbox
		    if ( 13==c ) {
		    	cout << "textBox content was: " << i->textInBox << endl;
		    	i->textInBox = "";
		    } else if ( '\b'==c || 127==c ) { // handle backspace
		    	if ( i->textInBox.length() > 0 ) i->textInBox.erase(i->textInBox.end()-1);
		    } else if ( c >= 32 && c <= 126 ) { // check for printable character
		    	// check that we don't overflow the box
		    	if ( i->textInBox.length() < MAX_NUM_CHARS_IN_TEXTBOX ) i->textInBox += c;
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

// the reshape function handles the case where the user changes the size
//   of the window.  We need to fix the coordinate
//   system, so that the drawing area is still the unit square.
void reshape(int w, int h) {
   glViewport(0, 0, (GLsizei) w, (GLsizei) h);
   WIDTH = w;  HEIGHT = h;
   glMatrixMode(GL_PROJECTION);
   glLoadIdentity();
   glOrtho(0., WIDTH-1, HEIGHT-1, 0., -1.0, 1.0);
}

// the mouse function is called when a mouse button is pressed down or released
void mouse(int mouseButton, int state, int x, int y) {
	if ( GLUT_LEFT_BUTTON == mouseButton ) {
		if ( GLUT_DOWN == state ) {
			for (vector<Button>::iterator i = buttons.begin(); i != buttons.end(); ++i) {
			    if (i->hover())
			    	i->active = true;
		      	else i->active = false;
			}
			for (vector<TextBox>::iterator i = textboxes.begin(); i != textboxes.end(); ++i) {
			    if (i->hover())
			    	i->active = true;
		      	else i->active = false;
			}
		} else {
		  	for (vector<Button>::iterator i = buttons.begin(); i != buttons.end(); ++i) {
			    if (i->hover() && i->active)
			    	cout << "Button press." << endl;
		      	i->active = false;
			}
			for (vector<TextBox>::iterator i = textboxes.begin(); i != textboxes.end(); ++i) {
			    if (i->hover() && i->active)
			    	cout << "Button press." << endl;
		      	i->active = false;
			}
			// for (vector<Label>::iterator i = labels.begin(); i != labels.end(); ++i) {
			   //  if (i->hover() && i->active)
			   //  	cout << "Label press." << endl;
		    //   	i->active = false;
			// } // todo: click on label to focus associated textbox
		}
	} else if ( GLUT_RIGHT_BUTTON == mouseButton ) {}
	glutPostRedisplay();
}

// the init function sets up the graphics card to draw properly
void init(void) {
	// clear the window to black
	glClearColor(0.0, 0.0, 0.0, 1.0);
	glClear(GL_COLOR_BUFFER_BIT);

	// set up the coordinate system:  number of pixels along x and y
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	glOrtho(0., WIDTH-1, HEIGHT-1, 0., -1.0, 1.0);

	// welcome message
	cout << "Welcome to " << programName << endl;
}


// initGlWindow is the function that starts the ball rolling, in
//  terms of getting everything set up and passing control over to the
//  glut library for event handling.  It needs to tell the glut library
//  about all the essential functions:  what function to call if the
//  window changes shape, what to do to redraw, handle the keyboard,
//  etc.
void initGlWindow() {
	char *argv[] = { programName };
	int argc = sizeof(argv) / sizeof(argv[0]);
	glutInit(&argc, argv);
	glutInitDisplayMode( GLUT_RGBA | GLUT_DOUBLE );
	glutInitWindowSize(WIDTH,HEIGHT);
	glutInitWindowPosition(100,100);
	glutCreateWindow(programName);
	init();

	glutDisplayFunc(drawWindow);
	glutReshapeFunc(reshape);
	glutKeyboardFunc(keyboard);
	glutMouseFunc(mouse);
	// glutMotionFunc(mouse_motion);
	// glutPassiveMotionFunc(mouse_motion);
	glutMainLoop();
}

int main() {
  initGlWindow();
}
