// __tests__/partialTitle-test.js
jest.dontMock('../../app/helpers/time');
jest.dontMock('lodash');

describe('time', function() {
	var _ = require('lodash');
	var timestrings = [];
	var time = require('../../app/helpers/time');

	beforeEach(function() {
		time = require('../../app/helpers/time');
		timestrings = [
			{times: ['F 0800-0855', 'F 0905-1000', 'F 1045-1140']},
			{times: ['M 0700-1000PM', 'MWF 0200-0255PM']},
			{times: ['M 0700-1000PM', 'MWF 1045-1140']},
			{times: ['M-F 0800-1000', 'M-F 0100-0300PM']},
			{times: ['MWF 0800-1000', 'MWF 1150-0150PM', 'Th 0800-0925',
				'Th 0935-1050', 'Th 1245-0205PM']},
			{times: ['M-F 0800-1000', 'MTThFW 1040-1240PM', 'M-F 0100-0300PM']},
			{times: ['Th 0700-0800']},
		];
	});

	it('turns the day abbreviations into a list of unambiguous days', function() {
		var findDays = time.findDays;

		expect(findDays('M')).toEqual(['Mo']);
		expect(findDays('T')).toEqual(['Tu']);
		expect(findDays('W')).toEqual(['We']);
		expect(findDays('Th')).toEqual(['Th']);
		expect(findDays('F')).toEqual(['Fr']);

		expect(findDays('M-F')).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr']);
		expect(findDays('M-Th')).toEqual(['Mo', 'Tu', 'We', 'Th']);
		expect(findDays('T-F')).toEqual(['Tu', 'We', 'Th', 'Fr']);
		expect(findDays('M-T')).toEqual(['Mo', 'Tu']);

		expect(findDays('MTThFW')).toEqual(['Mo', 'Tu', 'Th', 'Fr', 'We']);
		expect(findDays('MTTh')).toEqual(['Mo', 'Tu', 'Th']);
		expect(findDays('ThFMT')).toEqual(['Th', 'Fr', 'Mo', 'Tu']);
		expect(findDays('ThFMT')).not.toContain('We');

		expect(findDays('F')).toEqual(['Fr']);
		expect(findDays('M')).toEqual(['Mo']);
		expect(findDays('M-F')).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr']);
		expect(findDays('M-Th')).toEqual(['Mo', 'Tu', 'We', 'Th']);
		expect(findDays('MF')).toEqual(['Mo', 'Fr']);
		expect(findDays('MFW')).toEqual(['Mo', 'Fr', 'We']);
		expect(findDays('MT')).toEqual(['Mo', 'Tu']);
		expect(findDays('MTF')).toEqual(['Mo', 'Tu', 'Fr']);
		expect(findDays('MTTh')).toEqual(['Mo', 'Tu', 'Th']);
		expect(findDays('MTThF')).toEqual(['Mo', 'Tu', 'Th', 'Fr']);
		expect(findDays('MTThFW')).toEqual(['Mo', 'Tu', 'Th', 'Fr', 'We']);
		expect(findDays('MTW')).toEqual(['Mo', 'Tu', 'We']);
		expect(findDays('MTWF')).toEqual(['Mo', 'Tu', 'We', 'Fr']);
		expect(findDays('MTh')).toEqual(['Mo', 'Th']);
		expect(findDays('MW')).toEqual(['Mo', 'We']);
		expect(findDays('MWF')).toEqual(['Mo', 'We', 'Fr']);
		expect(findDays('MWFT')).toEqual(['Mo', 'We', 'Fr', 'Tu']);
		expect(findDays('MWTh')).toEqual(['Mo', 'We', 'Th']);
		expect(findDays('MWThF')).toEqual(['Mo', 'We', 'Th', 'Fr']);
		expect(findDays('T')).toEqual(['Tu']);
		expect(findDays('T-F')).toEqual(['Tu', 'We', 'Th', 'Fr']);
		expect(findDays('TTh')).toEqual(['Tu', 'Th']);
		expect(findDays('TThF')).toEqual(['Tu', 'Th', 'Fr']);
		expect(findDays('TW')).toEqual(['Tu', 'We']);
		expect(findDays('TWF')).toEqual(['Tu', 'We', 'Fr']);
		expect(findDays('TWTh')).toEqual(['Tu', 'We', 'Th']);
		expect(findDays('Th')).toEqual(['Th']);
		expect(findDays('W')).toEqual(['We']);
		expect(findDays('WF')).toEqual(['We', 'Fr']);
		expect(findDays('WTh')).toEqual(['We', 'Th']);
	});

	it('turns the absurd time shorthand into unambiguous 24-hour time', function() {
		var findTimes = time.findTimes;

		expect(findTimes('5:00-9:00')).toEqual({start: 500, end: 900});
		expect(findTimes('7:00-9:00')).toEqual({start: 700, end: 900});
		expect(findTimes('8:00-9:00')).toEqual({start: 800, end: 900});

		// all day courses!
		expect(findTimes('00-00')).toEqual({start: 0, end: 2359});

		expect(findTimes('0100-0200PM')).toEqual({start: 1300, end: 1400});
		expect(findTimes('0100-0215PM')).toEqual({start: 1300, end: 1415});
		expect(findTimes('0100-0230PM')).toEqual({start: 1300, end: 1430});
		expect(findTimes('0100-0300PM')).toEqual({start: 1300, end: 1500});
		expect(findTimes('0100-0330PM')).toEqual({start: 1300, end: 1530});
		expect(findTimes('0100-0400'  )).toEqual({start: 1300, end: 1600});
		expect(findTimes('0100-0400PM')).toEqual({start: 1300, end: 1600});
		expect(findTimes('0100-0500PM')).toEqual({start: 1300, end: 1700});

		expect(findTimes('0110-0245PM')).toEqual({start: 1310, end: 1445});
		expect(findTimes('0110-0340PM')).toEqual({start: 1310, end: 1540});

		expect(findTimes('0115-0159PM')).toEqual({start: 1315, end: 1359});
		expect(findTimes('0115-0200PM')).toEqual({start: 1315, end: 1400});
		expect(findTimes('0115-0215PM')).toEqual({start: 1315, end: 1415});
		expect(findTimes('0115-0230PM')).toEqual({start: 1315, end: 1430});
		expect(findTimes('0115-0245PM')).toEqual({start: 1315, end: 1445});
		expect(findTimes('0115-0300PM')).toEqual({start: 1315, end: 1500});

		expect(findTimes('0120-0215PM')).toEqual({start: 1320, end: 1415});
		expect(findTimes('0120-0220PM')).toEqual({start: 1320, end: 1420});
		expect(findTimes('0120-0225PM')).toEqual({start: 1320, end: 1425});
		expect(findTimes('0120-0245PM')).toEqual({start: 1320, end: 1445});
		expect(findTimes('0120-0250PM')).toEqual({start: 1320, end: 1450});
		expect(findTimes('0120-0255PM')).toEqual({start: 1320, end: 1455});
		expect(findTimes('0120-0320PM')).toEqual({start: 1320, end: 1520});
		expect(findTimes('0120-0320'  )).toEqual({start: 1320, end: 1520});
		expect(findTimes('0120-0330PM')).toEqual({start: 1320, end: 1530});
		expect(findTimes('0120-0350PM')).toEqual({start: 1320, end: 1550});
		expect(findTimes('0120-0355PM')).toEqual({start: 1320, end: 1555});
		expect(findTimes('0120-0420PM')).toEqual({start: 1320, end: 1620});
		expect(findTimes('0120-0450PM')).toEqual({start: 1320, end: 1650});
		expect(findTimes('0120-0520PM')).toEqual({start: 1320, end: 1720});

		expect(findTimes('0130-0230PM')).toEqual({start: 1330, end: 1430});
		expect(findTimes('0130-0300PM')).toEqual({start: 1330, end: 1500});
		expect(findTimes('0130-0330PM')).toEqual({start: 1330, end: 1530});
		expect(findTimes('0130-0400PM')).toEqual({start: 1330, end: 1600});
		expect(findTimes('0130-0430PM')).toEqual({start: 1330, end: 1630});
		expect(findTimes('0130-0530PM')).toEqual({start: 1330, end: 1730});

		expect(findTimes('0140-0440PM')).toEqual({start: 1340, end: 1640});

		expect(findTimes('0145-0245PM')).toEqual({start: 1345, end: 1445});
		expect(findTimes('0145-0300PM')).toEqual({start: 1345, end: 1500});


		expect(findTimes('0200-0245PM')).toEqual({start: 1400, end: 1445});
		expect(findTimes('0200-0255PM')).toEqual({start: 1400, end: 1455});
		expect(findTimes('0200-0300PM')).toEqual({start: 1400, end: 1500});
		expect(findTimes('0200-0320PM')).toEqual({start: 1400, end: 1520});
		expect(findTimes('0200-0325PM')).toEqual({start: 1400, end: 1525});
		expect(findTimes('0200-0330PM')).toEqual({start: 1400, end: 1530});
		expect(findTimes('0200-0335PM')).toEqual({start: 1400, end: 1535});
		expect(findTimes('0200-0340PM')).toEqual({start: 1400, end: 1540});
		expect(findTimes('0200-0400PM')).toEqual({start: 1400, end: 1600});
		expect(findTimes('0200-0430PM')).toEqual({start: 1400, end: 1630});
		expect(findTimes('0200-0500PM')).toEqual({start: 1400, end: 1700});
		expect(findTimes('0200-0600PM')).toEqual({start: 1400, end: 1800});

		expect(findTimes('0205-0255PM')).toEqual({start: 1405, end: 1455});
		expect(findTimes('0205-0335PM')).toEqual({start: 1405, end: 1535});

		expect(findTimes('0215-0310PM')).toEqual({start: 1415, end: 1510});
		expect(findTimes('0215-0315PM')).toEqual({start: 1415, end: 1515});
		expect(findTimes('0215-0335PM')).toEqual({start: 1415, end: 1535});
		expect(findTimes('0215-0405PM')).toEqual({start: 1415, end: 1605});
		expect(findTimes('0215-0415PM')).toEqual({start: 1415, end: 1615});
		expect(findTimes('0215-0445PM')).toEqual({start: 1415, end: 1645});
		expect(findTimes('0215-0445  ')).toEqual({start: 1415, end: 1645});
		expect(findTimes('0215-0500PM')).toEqual({start: 1415, end: 1700});
		expect(findTimes('0215-0505PM')).toEqual({start: 1415, end: 1705});
		expect(findTimes('0215-0515PM')).toEqual({start: 1415, end: 1715});

		expect(findTimes('0220-0520PM')).toEqual({start: 1420, end: 1720});

		expect(findTimes('0225-0315PM')).toEqual({start: 1425, end: 1515});
		expect(findTimes('0225-0455PM')).toEqual({start: 1425, end: 1655});

		expect(findTimes('0230-0325PM')).toEqual({start: 1430, end: 1525});
		expect(findTimes('0230-0330PM')).toEqual({start: 1430, end: 1530});
		expect(findTimes('0230-0400PM')).toEqual({start: 1430, end: 1600});
		expect(findTimes('0230-0415PM')).toEqual({start: 1430, end: 1615});
		expect(findTimes('0230-0430PM')).toEqual({start: 1430, end: 1630});
		expect(findTimes('0230-0500PM')).toEqual({start: 1430, end: 1700});
		expect(findTimes('0230-0530PM')).toEqual({start: 1430, end: 1730});

		expect(findTimes('0240-0335PM')).toEqual({start: 1440, end: 1535});

		expect(findTimes('0255-0340PM')).toEqual({start: 1455, end: 1540});
		expect(findTimes('0256-0340PM')).toEqual({start: 1456, end: 1540});


		// expect(findTimes('0300-0400PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0300-0430PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0300-0500PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0300-0530PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0300-0600PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0305-0400PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0305-0405PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0305-0415PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0305-0430PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0310-0415PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0310-0420PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0315-0415PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0315-0445PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0315-0515PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0320-0415PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0320-0420PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0330-0425PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0330-0430PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0330-0500PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0330-0530PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0330-0600PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0335-0530PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0335-0605PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0340-0610PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0345-0455PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0345-0515PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0345-0545PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0350-0450PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0355-0450PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0355-0515PM')).toEqual({start: 00, end: 00});


		// expect(findTimes('0400-0500PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0400-0530PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0400-0600PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0405-0530PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0430-0530PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0430-0600PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0450-0545PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0450-0600PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0450-0615PM')).toEqual({start: 00, end: 00});


		// expect(findTimes('0500-0600PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0500-0730PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0505-0615PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0530-0630PM')).toEqual({start: 00, end: 00});


		// expect(findTimes('0600-0655PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0600-0700PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0600-0730PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0600-0800PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0600-0830PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0600-0900PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0600-1000PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0630-0730PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0630-0800PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0630-0830PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0630-0900PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0630-0930PM')).toEqual({start: 00, end: 00});

		expect(findTimes('0645-0745')).toEqual({start: 1845, end: 1945});
		// expect(findTimes('0645-0745PM')).toEqual({start: 00, end: 00});


		// expect(findTimes('0700-0230PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0700-0300PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0700-0330PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0700-0755PM')).toEqual({start: 00, end: 00});
		expect(findTimes('0700-0800')).toEqual({start: 1900, end: 2000});
		// expect(findTimes('0700-0800PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0700-0830PM')).toEqual({start: 00, end: 00});
		expect(findTimes('0700-0900')).toEqual({start: 700, end: 900});
		// expect(findTimes('0700-0900PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0700-0930PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0700-1000PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0700-1230PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0730-0100PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0730-0230PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0730-0330PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0730-0400PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0730-0900PM')).toEqual({start: 00, end: 00});
		expect(findTimes('0730-0925')).toEqual({start: 730, end: 925});
		// expect(findTimes('0730-0930PM')).toEqual({start: 00, end: 00});
		expect(findTimes('0730-1000')).toEqual({start: 730, end: 1000});
		expect(findTimes('0730-1000PM')).toEqual({start: 1930, end: 2200});
		// expect(findTimes('0730-1200PM')).toEqual({start: 00, end: 00});


		// expect(findTimes('0800-0100PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-0400PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-0850')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-0855')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-0900')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-0900PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-0905')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-0920')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-0925')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-0930')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-0935')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-1000')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-1000PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-1030')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-1050')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-1100')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-1130')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-1200')).toEqual({start: 00, end: 00});
		// expect(findTimes('0800-1200PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0820-1050')).toEqual({start: 00, end: 00});

		// expect(findTimes('0825-0920')).toEqual({start: 00, end: 00});

		// expect(findTimes('0830-0300PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0830-0925')).toEqual({start: 00, end: 00});
		// expect(findTimes('0830-1000')).toEqual({start: 00, end: 00});
		// expect(findTimes('0830-1100')).toEqual({start: 00, end: 00});

		// expect(findTimes('0845-1000')).toEqual({start: 00, end: 00});

		// expect(findTimes('0850-1050')).toEqual({start: 00, end: 00});

		// expect(findTimes('0855-0950')).toEqual({start: 00, end: 00});


		// expect(findTimes('0900-0100PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0900-0200PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0900-0300PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0900-0330PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0900-0400PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0900-0500PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0900-0955')).toEqual({start: 00, end: 00});
		// expect(findTimes('0900-1000')).toEqual({start: 00, end: 00});
		// expect(findTimes('0900-1000PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0900-1050')).toEqual({start: 00, end: 00});
		// expect(findTimes('0900-1100')).toEqual({start: 00, end: 00});
		// expect(findTimes('0900-1200PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0900-1215PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('0900-1230PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('0905-1000')).toEqual({start: 00, end: 00});
		// expect(findTimes('0905-1140')).toEqual({start: 00, end: 00});

		// expect(findTimes('0915-1115')).toEqual({start: 00, end: 00});

		// expect(findTimes('0930-1025')).toEqual({start: 00, end: 00});
		// expect(findTimes('0930-1030')).toEqual({start: 00, end: 00});
		// expect(findTimes('0930-1045')).toEqual({start: 00, end: 00});
		// expect(findTimes('0930-1050')).toEqual({start: 00, end: 00});
		// expect(findTimes('0930-1100')).toEqual({start: 00, end: 00});

		// expect(findTimes('0935-1030')).toEqual({start: 00, end: 00});
		// expect(findTimes('0935-1035')).toEqual({start: 00, end: 00});
		// expect(findTimes('0935-1050')).toEqual({start: 00, end: 00});
		// expect(findTimes('0935-1100')).toEqual({start: 00, end: 00});
		// expect(findTimes('0935-1110')).toEqual({start: 00, end: 00});

		// expect(findTimes('0955-1050')).toEqual({start: 00, end: 00});


		// expect(findTimes('1000-1055')).toEqual({start: 00, end: 00});
		// expect(findTimes('1000-1130')).toEqual({start: 00, end: 00});
		// expect(findTimes('1000-1200')).toEqual({start: 00, end: 00});
		// expect(findTimes('1000-1200PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1000-1230PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1005-1100')).toEqual({start: 00, end: 00});

		// expect(findTimes('1010-1100')).toEqual({start: 00, end: 00});

		// expect(findTimes('1030-1145')).toEqual({start: 00, end: 00});
		// expect(findTimes('1030-1200PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1030-1230PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1040-0100PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-0110PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-0200PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-0300PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-0330PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-0500PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-1130')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-1135')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-1140')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-1150')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-1200')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-1200PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-1210PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-1215PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-1220PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-1230PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1040-1240PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1045-0100PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1045-0115PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1045-0145PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1045-1135')).toEqual({start: 00, end: 00});
		// expect(findTimes('1045-1140')).toEqual({start: 00, end: 00});
		// expect(findTimes('1045-1145')).toEqual({start: 00, end: 00});
		// expect(findTimes('1045-1150')).toEqual({start: 00, end: 00});
		// expect(findTimes('1045-1200PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1045-1215PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1045-1230PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1045-1245PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1045-1345PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1050-1220PM')).toEqual({start: 00, end: 00});


		// expect(findTimes('1100-0130PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1100-0200PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1100-1200PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1110-1240PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1125-0245PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1130-0130PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1130-0200PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1130-0230PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1140-1230PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1140-1240PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1145-0100PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1145-0110PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1145-0115PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1145-0120PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1145-0145PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1145-0200PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1145-0215PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1145-0245')).toEqual({start: 00, end: 00});
		// expect(findTimes('1145-0245PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1145-0345PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1145-1240')).toEqual({start: 00, end: 00});
		// expect(findTimes('1145-1240PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1145-1245PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1145-1250PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1150-0110PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1150-0150PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1150-0220PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1150-0250PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1150-0255PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1150-0350PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1150-1240PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1150-1245PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1150-1255PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1155-1250PM')).toEqual({start: 00, end: 00});


		// expect(findTimes('1200-0100PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1200-0150PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1200-0200PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1200-0230PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1200-0300PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1200-0400PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1215-0245PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1220-0150PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1220-0250PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1230-0100PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1230-0200PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1230-0230PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1230-0300PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1230-0330PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1230-0400PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1230-0430PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1235-0235PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1240-0330PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1240-0340PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1245-0105PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1245-0140PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1245-0145PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1245-0205PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1245-0215PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1245-0230PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1245-0245PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1245-0300PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1245-0315PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1245-0335PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1245-0345PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1245-1545PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1250-0320PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1250-0350PM')).toEqual({start: 00, end: 00});

		// expect(findTimes('1255-0110PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-0140PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-0145PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-0150PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-0155PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-0200PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-0230PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-0235PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-0255PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-0300PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-0325PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-0355PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-0500PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-1350PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-1355PM')).toEqual({start: 00, end: 00});
		// expect(findTimes('1255-1555PM')).toEqual({start: 00, end: 00});

		expect(findTimes('1:00-3:00PM')).toEqual({start: 1300, end: 1500});
		expect(findTimes('8:00-9:25')).toEqual({start: 800, end: 925});
	});

	it('turns the timestrings into semi-usable objects', function() {
		var convertTimeStringsToOfferings = time.convertTimeStringsToOfferings;
		var courses = [
			{times: ['MT 0100-0400PM','MF 0905-1000']},
			{times: ['M-Th 0100-0200PM','MF 0905-1000']}
		];

		expect(convertTimeStringsToOfferings(courses[0]).offerings)
			.toEqual([
				{day: 'Mo', times: [
					{end: 1600, start: 1300},
					{end: 1000, start: 905}
				]},
				{day: 'Tu', times: [{end: 1600, start: 1300}]},
				{day: 'Fr', times: [{end: 1000, start: 905}]}
			])
		expect(convertTimeStringsToOfferings(courses[1]).offerings)
			.toEqual([
				{day: 'Mo', times: [
					{end: 1400, start: 1300},
					{end: 1000, start: 905}
				]},
				{day: 'Tu', times: [
					{end: 1400, start: 1300}]},
				{day: 'We', times: [
					{end: 1400, start: 1300}]},
				{day: 'Th', times: [
					{end: 1400, start: 1300}]},
				{day: 'Fr', times: [
					{end: 1000, start: 905}]}
			])
	});
});
