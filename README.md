# Gobbldygook

[![Build Status](https://travis-ci.org/hawkrives/gobbldygook.svg?branch=master)](https://travis-ci.org/hawkrives/gobbldygook)
[![Code Coverage](https://coveralls.io/repos/hawkrives/gobbldygook/badge.svg?branch=master&service=github)](https://coveralls.io/github/hawkrives/gobbldygook?branch=master)

This is a course scheduler for students at St. Olaf College. You give it your areas of study (majors, concentrations, degrees), the courses you *have* taken and are *planning* on taking, and it tells you if you can graduate or not.

We have a [trello board](https://trello.com/b/cviTwkre) where we track which areas of study we are working on; if you have one in particular that you want us to work on next, let us know by either voting on the Trello card or emailing us!


## Playing
1. Visit https://stolaf.edu/people/rives/g
    – Gobbldygook currently supports every major browser, except for Safari, and apparently Internet Explorer – unintentional, and on the to-do list. (so Chrome, Firefox, Internet Explorer 11, and probably Microsoft Edge).
    – Let's just say that Safari's database support is … a bit lacking.
    – On iOS devices, every browser is required to use Safari internally, which means that Chrome, Opera, and Safari on iOS all have the same terrible database support.
    – In short: you can't use Safari, iPhone, iPad, or Apple Watch to access Gobbldygook. :-(

2. Push "New Student": you can either choose to import your data from the SIS, write down your information manually, or import a previously-exported student file.

3. Search for the courses you have taken and are planning on taking, and drag them into the appropriate semesters.
    – Make sure to choose the right offering for each semester!
    – If you use the "search" button on a semester, it will automatically limit your search to just that semester, which might be helpful.


## Hacking
- Prerequisites: [node.js](https://nodejs.org) and [git](https://git-scm.com).
- `git clone https://github.com/hawkrives/gobbldygook.git`
- `cd gobbldygook`
- `npm install`
- `npm start`

You can see additional commands by executing `npm run` with no arguments.


## Support
You can file an issue via [github](https://github.com/hawkrives/gobbldygook/issues/), or you can send us an email, if you look us up on Stalkernet.


## Credits
- Initial concept from @xandrasings
- Final project for Software Design, @hawkrives and @xandrasings
- So much of the internet.
- Teammate for January 2015: @drewvolz
- Professor Hanson, for agreeing to be our advisor over Interim


## Screenshot

### 2015 – September
![Screenshot, september 2015](./screenshots/september-2015.png)

### 2014 - September
![Screenshot, september 2014](./screenshots/september-2014.png)
