# Gobbldygook

[![Build Status](https://travis-ci.org/hawkrives/gobbldygook.svg?branch=master)](https://travis-ci.org/hawkrives/gobbldygook)
[![Code Coverage](https://coveralls.io/repos/hawkrives/gobbldygook/badge.svg?branch=master&service=github)](https://coveralls.io/github/hawkrives/gobbldygook?branch=master)

This is a course scheduler for students at St. Olaf College. You give it your areas of study (majors, concentrations, degrees), the courses you *have* taken and are *planning* on taking, and it tells you if you can graduate or not.


## Playing
1. Visit [https://stolaf.edu/people/rives/g](https://stolaf.edu/people/rives/g)
    - Gobbldygook currently supports every major browser, except for Safari (so Chrome, Firefox, Internet Explorer 11, and probably Microsoft Edge).
    - Let's just say that Safari's database support is … a bit lacking.
    - On iOS devices, every browser is required to use Safari internally, which means that Chrome, Opera, and Safari on iOS all have the same terrible database support.
    - In summary: **don't use Safari, iPhones, iPads, or Apple Watches** to access Gobbldygook.

2. Wait for the progress bars in the corner to go away ;-)
	1. Then push "New Student".

3. Fill out the student information form on the left: your name (or whatever you want to put there) and your matriculation and graduation.

4. Add your areas of study: your degrees, majors, concentrations, and areas of emphasis.

5. Search for the courses you have taken and are planning on taking, and drag them into the appropriate semesters.
    - Make sure to choose the right offering for each semester!
    - If you use the "search" button on a semester, it will automatically limit your search to just that semester, which might be helpful.

If you've already been testing it, then you already have some data entered. You can now edit your name and matriculation/graduation years, and even add and remove areas of study! No longer are you bound by the shackles of "what did Hawken put in the demo student?"


## Hacking
- Prerequisites: [node.js](https://nodejs.org) and [git](https://git-scm.com).
- `git clone https://github.com/hawkrives/gobbldygook.git`
- `cd gobbldygook`
- `npm install`
- `npm start`

You can see additional commands by executing `npm run` with no arguments.


## Support
We highly recommend joining our Slack chatroom. Just go to [gobbldygook.slack.com](https://gobbldygook.slack.com) and sign up for an account with your St. Olaf email.

If you don't want to join us there, you can file an issue via [github](https://github.com/hawkrives/gobbldygook/issues/), or you can send us an email, if you look us up on Stalkernet.


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
