# Gobbldygook
[![Build Status](https://travis-ci.org/hawkrives/gobbldygook.svg?branch=master)](https://travis-ci.org/hawkrives/gobbldygook)

This is a course scheduler for students at St. Olaf College. You give it your areas of study (majors, concentrations, degrees), the course you *have* taken and are *planning* on taking, and it tells you if you can graduate or not.


## Playing
1. Go to <http://www.cs.stolaf.edu/users/rives/g/>
2. Input your data
3. ???
4. Profit!


## Hacking
Copy/paste for setup:
```bash
git clone https://github.com/hawkrives/gobbldygook.git
cd gobbldygook
git submodule init && git submodule update
npm install
npm run serve
```

In short: clone, prepare submodules, install dependencies, and build.

Available commands are in `package.json` under the `scripts` key.


## Credits
- Initial concept from @xandrasings
- Final project for Software Design, @hawkrives and @xandrasings
- So much of the internet.
- Teammate for January 2015: @drewvolz
- Professor Hanson, for agreeing to be our advisor over Interim


## Screenshot
![Screenshot!](./screenshot.png)
