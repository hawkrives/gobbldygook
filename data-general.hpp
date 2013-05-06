#ifndef __Data_general__
#define __Data_general__

#include <iostream>
#include <sstream>
#include <fstream>
#include <vector>
#include <algorithm>    // has the for_each

using namespace std;

enum GenEd {
	// Foundation Studies
	FYW,   // First-Year Writing 
	WRI,   // Writing in Context
	FOL,   // Foreign Language
	ORC,   // Oral Communication
	AQR,   // Abstract and Quantitative Reasoning
	SPM,   // Studies in Physical Movement

	// Core Studies
	HWC,   // Historical Studies in Western Culture
	MCD,   // Multicultural Studies: Domestic
	MCG,   // Multicultural Studies: Global
	ALSA,  // Artistic and Literary Studies: Artistic Studies
	ALSL,  // Artistic and Literary Studies: Literary Studies
	BTSB,  // Biblical and Theological Studies: Bible
	BTST,  // Biblical and Theological Studies: Theology
	SED,   // Studies in Natural Science: Scientific Exploration and Discovery
	IST,   // Studies in Natural Science: Integrated Scientific Topics
	HBS,   // Studies in Human Behavior and Society

	// Integrative Studies
	EIN    // Ethical Issues and Normative Perspectives
};

#endif

