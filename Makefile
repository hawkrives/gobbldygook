SHELL= /bin/sh
CC   = g++
CFLAGS = -Wall -g
ARCH := $(shell uname)
ifeq ($(ARCH), Linux)
else
CC = clang++
MACOSX_DEFINE = -DMACOSX -I/sw/include
LIBS = -I/usr/common/include
endif

OBJECTS = data-general.o \
	data-course.o \
	data-department.o \
	data-major.o \
	data-majorRequirement.o \
	data-student.o

# $@ takes the label of the rule
# $< takes the thing to the right of the label

main: test-data.o
	$(CC) $(CFLAGS) -o $@ $< $(OBJECTS) $(LIBS)

## # # # # # # ##

test-data.o: $(OBJECTS) test-data.cpp
	$(CC) $(CFLAGS) $(MACOSX_DEFINE) $(LIBS) -c test-data.cpp

## # # # # # # ##

%.o: %.cpp
	$(CC) $(CFLAGS) $(MACOSX_DEFINE) $(LIBS) -c $<

clean:
	rm -f *.o main
