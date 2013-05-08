SHELL= /bin/sh
CC   = g++
OPTS = -Wall -g
LIBS = -lGL -lglut -lm
ARCH := $(shell uname)
ifeq ($(ARCH), Linux)
else
CC = clang++
MACOSX_DEFINE = -DMACOSX -I/sw/include
INCLUDES = -I/usr/common/include
LIBS = $(INCLUDES) \
	-lm -lobjc -lstdc++
endif

DATA_OBJ = data-conversation.o data-concentration.o data-course.o data-department.o data-general.o data-instructor.o data-major.o data-student.o
OBJECTS = $(DATA_OBJ)

all: data-test

data-test: data-test.o
	$(CC) $(OPTS) -o data-test data-test.o $(LIBS)


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
