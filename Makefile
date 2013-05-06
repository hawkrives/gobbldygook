SHELL= /bin/sh
CC   = g++
OPTS = -Wall -g
LIBS = -lGL -lglut -lm
ARCH := $(shell uname)
ifeq ($(ARCH), Linux)
else
CC = clang++
MACOSX_DEFINE = -DMACOSX -I/sw/include
INCLUDES = -I/usr/common/include -I/usr/include/GL 
LIBS = $(INCLUDES) \
	-L/System/Library/Frameworks/OpenGL.framework/Libraries \
	-framework GLUT -framework OpenGL -lGL -lm -lobjc -lstdc++
endif

UI_OBJ = ui-rect.o ui-toggle.o ui-buttons.o ui-textboxes.o ui-label.o rectangle.o color.o
DATA_OBJ = data-conversation.o data-concentration.o data-course.o data-department.o data-general.o data-instructor.o data-major.o data-student.o
OBJECTS = $(UI_OBJ) $(DATA_OBJ)

all: schedule.cpp $(OBJECTS)
	$(CC) $(OPTS) -o schedule schedule.cpp $(OBJECTS) $(LIBS)

data-test: data-test.o
	$(CC) $(OPTS) -o data-test data-test.o $(LIBS)

ui-test: ui-test.o
	$(CC) $(OPTS) -o ui-test ui-test.o $(UI_OBJ) $(LIBS)


data-test.o: $(DATA_OBJ)
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c data-test.cpp

data-concentration.o: data-concentration.hpp data-general.o
data-conversation.o: data-conversation.hpp data-general.o
data-course.o: data-course.hpp data-major.o data-department.o data-conversation.o data-concentration.o data-instructor.o data-general.o
data-department.o: data-department.hpp data-general.o
data-instructor.o: data-instructor.hpp data-general.o
data-major.o: data-major.hpp data-general.o
data-student.o: data-student.hpp data-course.o data-major.o data-conversation.o data-concentration.o data-instructor.o data-general.o

data-general.o: data-general.hpp

ui-test.o: $(UI_OBJ)
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c ui-test.cpp

ui-toggle.o: ui-toggle.cpp ui-toggle.hpp ui-rect.o
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c ui-toggle.cpp

ui-buttons.o: ui-buttons.cpp ui-buttons.hpp ui-rect.o
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c ui-buttons.cpp

ui-textboxes.o: ui-textboxes.cpp ui-textboxes.hpp ui-rect.o
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c ui-textboxes.cpp


ui-rect.o: ui-rect.cpp ui-rect.hpp ui-label.o rectangle.o ui-general
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c ui-rect.cpp

ui-label.o: ui-label.cpp ui-label.hpp ui-general
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c ui-label.cpp


rectangle.o: rectangle.cpp rectangle.hpp ui-general
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c rectangle.cpp

ui-general: ui.hpp color.o

color.o: color.cpp color.hpp
	$(CC) $(OPTS) $(MACOSX_DEFINE) $(INCLUDES) -c color.cpp

clean:
	rm -f *.o schedule
