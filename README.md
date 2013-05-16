# Class Scheduler for St. Olaf College
Software Design (CSCI 251) Final Project by Hawken Rives and Xandra Best

## Initial Idea
Our initial concept was a program that, when presented with a list of majors, concentrations, and courses, could parse them and determine what you still needed to do before graduation.

## What It Does

## Prerequisites
- A relatively modern C++ compiler, such as GCC 4.7 or Clang 4.2.
- ~5MB of free disk space
- Some unknown amount of memory
- A reasonable CPU (disclaimer: we have not tested on anything older than Intel's Core 2 Duo line).
- A terminal. We have not tested with anything besides Terminal.app and gnome-terminal, but most others should work. We have no interest in supporting Windows' `cmd` at this time.

## How To Use

## F.A.Q.

Why does my course show up as "NONE (Unknown)"?
: That happens when the system cannot locate a course with the same ID as the one requested. It most commonly occurs when you either forget to inculde the section, or you include a section where there is not one. For example, `AmCon 201` is not a valid course, because there are two sections of AmCon. You would need to enter `AmCon 201A` to allow it to recognize the proper course.

Do I need to format the input file in any way?
: Kinda?
: Course IDs can be in the form `CSCI 251`, `Computer Science 251`, `Csci 251`, or `cScI 251`. 