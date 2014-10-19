gulp = node node_modules/gulp/bin/gulp.js

all: serve

.PHONY: clean script style serve test watch

build:
	$(gulp) default

scripts:
	$(gulp) scripts

scripts-nowatch:
	$(gulp) scripts-nowatch

styles:
	$(gulp) styles

serve:
	$(gulp) serve

# build:
# 	# cssshrink
# 	# colorguard
# 	# uglifyjs

cloc:
	cloc . --exclude-dir=data,node_modules,dist,.idea,test --by-file-by-lang

clean:
	$(gulp) clean
