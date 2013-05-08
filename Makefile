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

# data-concentration.o: data-concentration.hpp data-general.o
# data-conversation.o: data-conversation.hpp data-general.o
data-course.o: data-course.hpp data-major.o data-department.o data-conversation.o data-concentration.o data-instructor.o data-general.o
# data-department.o: data-department.hpp data-general.o
# data-instructor.o: data-instructor.hpp data-general.o
data-major.o: data-major.hpp data-general.o
data-student.o: data-student.hpp data-course.o data-major.o data-conversation.o data-concentration.o data-instructor.o data-general.o

data-general.o: data-general.hpp

clean:
	rm -f *.o schedule
