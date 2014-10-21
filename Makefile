gulp = node node_modules/gulp/bin/gulp.js

all: serve

.PHONY: build clean scripts scripts-nowatch styles serve test cloc

build:
	$(gulp) default

scripts:
	$(gulp) scripts
	# uglifyjs

scripts-nowatch:
	$(gulp) scripts-nowatch

styles:
	$(gulp) styles
	# cssshrink
	# colorguard

serve:
	$(gulp) serve

test:
	npm test

cloc:
	cloc . --exclude-dir=data,node_modules,dist,.idea,test --by-file-by-lang

clean:
	$(gulp) clean
