#include "ui.h"
#include "ui-buttons.cpp"
#include "ui-label.cpp"
#include "ui-textboxes.cpp"
using namespace std;

int WIDTH = 1280;  // width of the user window
int HEIGHT = 768;  // height of the user window
char programName[] = "scheduler";

bool WELCOME = true;

// button info
vector<Button> buttons;
vector<Rectangle> boxes;
vector<TextBox> textboxes;
vector<Label> labels;

const unsigned int MAX_NUM_CHARS_IN_TEXTBOX = 20;

void create_welcome_screen() {
	if (WELCOME) {
		double label_x = WIDTH/5, label_y_base = 140, y_multiplier = 70;
		labels.push_back(Label(WIDTH/2-22.5, 50, "Hello!"));
		labels.push_back(Label(label_x, label_y_base+y_multiplier*0, "Name"));
		labels.push_back(Label(label_x, label_y_base+y_multiplier*1, "Majors"));
		labels.push_back(Label(label_x, label_y_base+y_multiplier*2, "Concentrations"));
		labels.push_back(Label(label_x, label_y_base+y_multiplier*3, "Year"));
		
		double textbox_height = 40, textbox_width = 220;
		double textbox_x = WIDTH/5*2.5, textbox_y_base = label_y_base-(.6*textbox_height);
		textboxes.push_back(TextBox(textbox_x, textbox_y_base+y_multiplier*0, textbox_width, textbox_height, ""));
		textboxes.push_back(TextBox(textbox_x, textbox_y_base+y_multiplier*1, textbox_width, textbox_height, ""));
		textboxes.push_back(TextBox(textbox_x, textbox_y_base+y_multiplier*2, textbox_width, textbox_height, ""));
		textboxes.push_back(TextBox(textbox_x, textbox_y_base+y_multiplier*3, textbox_width, textbox_height, ""));
		
		buttons.push_back(Button(WIDTH/2-100, 5, 100, 50, "Cancel"));
		buttons.push_back(Button(WIDTH/2+0, 5, 100, 50, "OK"));
	} else {
		labels.clear();
		textboxes.clear();
		buttons.clear();

		double heading_start_y = 10;
		// Heading
		labels.push_back(Label(190, heading_start_y, "Reqs"));
		// Majors
		labels.push_back(Label(425, heading_start_y, "Math"));
		labels.push_back(Label(525, heading_start_y, "Comp Sci"));
		// Concentrations
		labels.push_back(Label(625, heading_start_y, "Stats"));


		// boxes.push_back(Rectangle(5, 25, 405, 736));    // Requirements bg
		// boxes.push_back(Rectangle(420, 25, 214, 184));  // y1 s1
		// boxes.push_back(Rectangle(420, 209, 214, 184)); // y2 s1
		// boxes.push_back(Rectangle(420, 393, 214, 184)); // y3 s1
		// boxes.push_back(Rectangle(420, 577, 214, 184)); // y4 s1
		// boxes.push_back(Rectangle(634, 25, 107, 184));  // y1 interim
		// boxes.push_back(Rectangle(634, 209, 107, 184)); // y2 interim
		// boxes.push_back(Rectangle(634, 393, 107, 184)); // y3 interim
		// boxes.push_back(Rectangle(634, 577, 107, 184)); // y4 interim
		// boxes.push_back(Rectangle(741, 25, 214, 184));  // y1 s2
		// boxes.push_back(Rectangle(741, 209, 214, 184)); // y2 s2
		// boxes.push_back(Rectangle(741, 393, 214, 184)); // y3 s3
		// boxes.push_back(Rectangle(741, 577, 214, 184)); // y4 s2


		labels.push_back(Label(10, 30, "Basic Reqs"));
		labels.push_back(Label(10, 50, "35 total course credits"));
		labels.push_back(Label(10, 70, "18 level II/III course credits"));
		labels.push_back(Label(10, 90, "3 interims"));

		double reqs_vert_space = 20;
		double ge_reqs_start_y = 50;
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*4, "GEs"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*5, "FYW"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*6, "FOL"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*7, "ORC"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*8, "AQR"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*9, "SPM"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*10, "HWC"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*11, "MCD"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*12, "MCG"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*13, "ALS-A"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*14, "ALS-L"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*15, "BTS-B"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*16, "BTS-T"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*17, "SED"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*18, "IST"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*19, "HBS"));
		labels.push_back(Label(10, ge_reqs_start_y+reqs_vert_space*20, "EIN"));

		double math_reqs_start_y = 470;
		labels.push_back(Label(10, math_reqs_start_y+reqs_vert_space*0, "Math Reqs"));
		labels.push_back(Label(10, math_reqs_start_y+reqs_vert_space*1, "Calc I"));
		labels.push_back(Label(10, math_reqs_start_y+reqs_vert_space*2, "Calc II"));
		labels.push_back(Label(10, math_reqs_start_y+reqs_vert_space*3, "Math 220"));
		labels.push_back(Label(10, math_reqs_start_y+reqs_vert_space*4, "2 transition courses"));
		labels.push_back(Label(10, math_reqs_start_y+reqs_vert_space*5, "3 perspectives"));
		labels.push_back(Label(10, math_reqs_start_y+reqs_vert_space*6, "2 level III courses"));
		labels.push_back(Label(10, math_reqs_start_y+reqs_vert_space*7, "sequence courses"));
		labels.push_back(Label(10, math_reqs_start_y+reqs_vert_space*8, "7 courses"));

		double cs_reqs_start_y = 120;
		labels.push_back(Label(110, cs_reqs_start_y+reqs_vert_space*0, "CS Reqs"));
		labels.push_back(Label(110, cs_reqs_start_y+reqs_vert_space*1, "CS1"));
		labels.push_back(Label(110, cs_reqs_start_y+reqs_vert_space*2, "MFC"));
		labels.push_back(Label(110, cs_reqs_start_y+reqs_vert_space*3, "HD"));
		labels.push_back(Label(110, cs_reqs_start_y+reqs_vert_space*4, "SD"));
		labels.push_back(Label(110, cs_reqs_start_y+reqs_vert_space*5, "ADS"));
		labels.push_back(Label(110, cs_reqs_start_y+reqs_vert_space*6, "ESD"));
		labels.push_back(Label(110, cs_reqs_start_y+reqs_vert_space*7, "PL or TC"));
		labels.push_back(Label(110, cs_reqs_start_y+reqs_vert_space*8, "OS or CSA"));
		labels.push_back(Label(110, cs_reqs_start_y+reqs_vert_space*9, "CAP"));
		labels.push_back(Label(110, cs_reqs_start_y+reqs_vert_space*10, "2 electives"));

		labels.push_back(Label(110, 330, "Stats reqs"));
		labels.push_back(Label(110, 350, "STAT 272"));
		labels.push_back(Label(110, 370, "STAT 316"));
		labels.push_back(Label(110, 390, "2 electives"));


		labels.push_back(Label(423, 27, "MATH 220"));
		labels.push_back(Label(426, 42, "Elem Linear Algebra"));
		labels.push_back(Label(423, 57, "MUSPF 152"));
		labels.push_back(Label(426, 72, "Voice"));
		labels.push_back(Label(423, 87, "PSYCH 125"));
		labels.push_back(Label(426, 102, "Principles: Psych"));
		labels.push_back(Label(423, 117, "SPAN 231"));
		labels.push_back(Label(426, 132, "Intermed Spanish I"));
		labels.push_back(Label(423, 147, "WRIT 111"));
		labels.push_back(Label(426, 162, "First-Year Writing"));

		labels.push_back(Label(637, 27, "PHIL 127"));
		labels.push_back(Label(640, 42, "Zen and Art of Judo"));

		labels.push_back(Label(744, 27, "MATH 252"));
		labels.push_back(Label(747, 42, "Abstract Algebra I"));
		labels.push_back(Label(744, 57, "MUSPF 152"));
		labels.push_back(Label(747, 72, "Voice"));
		labels.push_back(Label(744, 87, "REL 121"));
		labels.push_back(Label(747, 102, "Bible/Culture/Commun"));
		labels.push_back(Label(744, 117, "SPAN 232"));
		labels.push_back(Label(747, 132, "Intermed Spanish II"));
		labels.push_back(Label(744, 147, "STAT 272"));
		labels.push_back(Label(747, 162, "Statistical Modeling"));

		labels.push_back(Label(423, 211, "CSCI 125"));
		labels.push_back(Label(426, 226, "Comp Sci for Science/Math"));
		labels.push_back(Label(423, 241, "ENGL 201"));
		labels.push_back(Label(426, 256, "Transatlantic Anglo Lit"));
		labels.push_back(Label(423, 271, "MUSPF 152"));
		labels.push_back(Label(426, 286, "Voice"));
		labels.push_back(Label(423, 301, "PHIL 118"));
		labels.push_back(Label(426, 316, "Making of Modern Mind"));
		labels.push_back(Label(423, 331, "REL 264"));
		labels.push_back(Label(426, 346, "Theology and Sexuality"));

		labels.push_back(Label(637, 211, "CHEM 124"));
		labels.push_back(Label(640, 226, "A Matter of Environ"));
		labels.push_back(Label(637, 241, "CHEM 124"));
		labels.push_back(Label(640, 256, "A Matter of Environ Lab"));

		labels.push_back(Label(744, 211, "CSCI 251"));
		labels.push_back(Label(747, 226, "Software Design"));
		labels.push_back(Label(744, 241, "CSCI 252"));
		labels.push_back(Label(747, 256, "Software Design/Lab"));
		labels.push_back(Label(744, 271, "ECON 121"));
		labels.push_back(Label(747, 286, "Principles of Econ"));
		labels.push_back(Label(744, 301, "MATH 244"));
		labels.push_back(Label(747, 316, "Real Analysis I"));
		labels.push_back(Label(744, 331, "MUSPF 152"));
		labels.push_back(Label(747, 346, "Voice"));

		labels.push_back(Label(423, 395, "CSCI 241"));
		labels.push_back(Label(426, 410, "Hardware Design"));
		labels.push_back(Label(423, 425, "CSCI 333"));
		labels.push_back(Label(426, 440, "Theory of Computation"));
		labels.push_back(Label(423, 455, "ESAC 108"));
		labels.push_back(Label(426, 470, "In-Line Skating"));
		labels.push_back(Label(423, 485, "MATH 382"));
		labels.push_back(Label(426, 500, "Sem: Linear Algebra"));
		labels.push_back(Label(423, 515, "MUSPF 152"));
		labels.push_back(Label(426, 530, "Voice"));

		labels.push_back(Label(744, 395, "CSCI 263"));
		labels.push_back(Label(747, 410, "Ethical Issues in Software"));
		labels.push_back(Label(744, 425, "CSCI 276"));
		labels.push_back(Label(747, 440, "Programming Languages"));
		labels.push_back(Label(744, 455, "MUSPF 152"));
		labels.push_back(Label(747, 470, "Voice"));

		labels.push_back(Label(423, 579, "CSCI 253"));
		labels.push_back(Label(426, 594, "Algorithms and Data Structures"));
		labels.push_back(Label(423, 609, "CSCI 390"));
		labels.push_back(Label(426, 624, "Capstone Seminar"));
		labels.push_back(Label(423, 639, "HIST 275"));
		labels.push_back(Label(426, 654, "Environmental History"));
		labels.push_back(Label(423, 669, "MUSPF 152"));
		labels.push_back(Label(426, 684, "Voice"));
		
		for (vector<Rectangle>::iterator i = boxes.begin(); i != boxes.end(); ++i)
			i->setColor(Color(0));
	}
}

void drawWindow() {
	glClear(GL_COLOR_BUFFER_BIT); // clear the buffer
	
	if(!WELCOME)
		create_welcome_screen();

	for (vector<Button>::iterator i = buttons.begin(); i != buttons.end(); ++i)      i->draw();
	for (vector<TextBox>::iterator i = textboxes.begin(); i != textboxes.end(); ++i) i->draw();
	for (vector<Rectangle>::iterator i = boxes.begin(); i != boxes.end(); ++i)       i->draw();
	for (vector<Label>::iterator i = labels.begin(); i != labels.end(); ++i)         i->draw();

	glutSwapBuffers(); // tell the graphics card that we're done.
}

// close the window and finish the program
void exitAll() {
	int win = glutGetWindow();
	glutDestroyWindow(win);
	exit(0);
}

// process keyboard events
void keyboard( unsigned char c, int x, int y ) {
	for (vector<TextBox>::iterator i = textboxes.begin(); i != textboxes.end(); ++i) {
		// intercept keyboard press, to place in text box
		if ( i->hover(x, y)) {
			// escape terminates the program, even in textbox
		    if ( c == 27 ) exitAll();

			// if enter, print the contents
		    if ( c == 13 ) {
		    	cout << "textbox content: " << i->label.contents << endl;
			}
		    else if ( c == '\b' || c == 127 ) {			// handle backspace
		    	if ( i->label.contents.length() > 0 )
					i->label.contents.erase(i->label.contents.end()-1);
			}
			else if ( c >= 32 && c <= 126 ) { 			// check for printable character and make sure that we don't overflow the box
		    	if ( i->label.contents.length() < MAX_NUM_CHARS_IN_TEXTBOX )
					i->label.contents.push_back(c);
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

// the reshape function handles the case where the user changes the size of the window.  We need to fix the coordinate system, so that the drawing area is still the unit square.
void reshape(int w, int h) {
	glViewport(0, 0, (GLsizei) w, (GLsizei) h);
	WIDTH = w;  HEIGHT = h;
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	glOrtho(0., WIDTH-1, HEIGHT-1, 0., -1.0, 1.0);
}

void mouse(int mouseButton, int state, int x, int y) {
	// the mouse function is called when a mouse button is pressed down or released
	if ( mouseButton == GLUT_LEFT_BUTTON ) {
		if ( state == GLUT_DOWN ) {
			for (vector<Button>::iterator i = buttons.begin(); i != buttons.end(); ++i) {
				if (i->hover(x, y)) {
					i->over = true;
					i->active = true;
					if (WELCOME && i->label.contents == "OK") {
						WELCOME = false;
					}
				} else {
					i->over = false;
					i->active = false;
				}
			}
			for (vector<TextBox>::iterator i = textboxes.begin(); i != textboxes.end(); ++i) {
				if (i->over) {
					i->active = true;
				}
				else {
					i->active = false;
				}
			}
		} else if (state == GLUT_UP) {
			for (vector<Button>::iterator i = buttons.begin(); i != buttons.end(); ++i) {
				if (i->hover(x, y)) {
					i->over = false;
					i->active = false;
				}
			}
			for (vector<TextBox>::iterator i = textboxes.begin(); i != textboxes.end(); ++i) {
				if (i->hover(x, y)) {
					i->over = false;
					i->active = false;
				}
			}
		}
	} else if ( GLUT_RIGHT_BUTTON == mouseButton ) {}
	glutPostRedisplay();
}
void mouse_motion(int x, int y) {
	// mouse_motion seems to be called whenever the mouse moves within the window.
	for (vector<Button>::iterator i = buttons.begin(); i != buttons.end(); ++i) {
		if (i->hover(x, y)) {
			i->over = true;
		} else {
			i->over = false;
		}
	}
	for (vector<TextBox>::iterator i = textboxes.begin(); i != textboxes.end(); ++i) {
		if (i->hover(x, y)) {
			i->over = true;
		} else {
			i->over = false;
		}
	}
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


// initGlWindow is the function that starts the ball rolling, in  terms of getting everything set up and passing control over to the glut library for event handling. It needs to tell the glut library about all the essential functions: what function to call if the window changes shape, what to do to redraw, handle the keyboard, etc.
void initGlWindow() {
	char *argv[] = { programName };
	int argc = sizeof(argv) / sizeof(argv[0]);
	glutInit(&argc, argv);
	glutInitDisplayMode( GLUT_RGBA | GLUT_DOUBLE );
	glutInitWindowSize(WIDTH,HEIGHT);
	glutInitWindowPosition(100,100);
	glutCreateWindow(programName);

	init();
	create_welcome_screen();
	
	glutDisplayFunc(drawWindow);
	glutReshapeFunc(reshape);
	glutKeyboardFunc(keyboard);
	glutMouseFunc(mouse);
	glutMotionFunc(mouse_motion);
	glutPassiveMotionFunc(mouse_motion);
	glutMainLoop();
}

int main() {
	initGlWindow();
}
