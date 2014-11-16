gulp = node node_modules/.bin/gulp
uglifyjs = node node_modules/.bin/uglifyjs
cssshrink = node node_modules/.bin/cssshrink

all:
	@echo "You can run these commands via make:"
	@echo "make build:    Run the build process"
	@echo "make clean:    Clean the dist/ dir (by deleting it)"
	@echo "make cloc:     If you have cloc installed, will count lines of code"
	@echo "make dist:     Build, then uglify, minify, and compress"
	@echo "make scripts:  Just builds the scripts"
	@echo "make sass:     Just builds the stylesheets"
	@echo "make test:     Prepares and runs the tests"
	@echo "make uglify:   uglify app.js -> app.min.js"


.PHONY: build clean cloc dist sass scripts serve shrink-node test uglify watch

build:
	$(gulp) build

clean:
	$(gulp) clean

cloc:
	cloc . --exclude-dir=data,node_modules,dist,.idea,test --by-file-by-lang

dist: | clean build uglify
	# can't use cssshrink b/c it joins the progress bar selectors
	# $(cssshrink) dist/app.css > dist/app.min.css

sass:
	$(gulp) sass

scripts:
	$(gulp) browserify

serve:
	$(gulp) watch

shrink-node:
	npm dedupe
	dmn clean -list

test:
	npm test

uglify:
	$(uglifyjs) dist/app.js --in-source-map dist/app.js.map --source-map dist/app.js.ug.map --screw-ie8 -c --stats -o dist/app.min.js

watch:
	$(gulp) watch
