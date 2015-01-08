// tests/time.test.js
import {
	findDays,
	findTimes,
	convertTimeStringsToOfferings,
	checkCourseTimeConflicts} from 'app/helpers/time'

describe('time', () => {
	it('turns the day abbreviations into a list of unambiguous days', () => {
		findDays('M').should.eql(['Mo'])
		findDays('T').should.eql(['Tu'])
		findDays('W').should.eql(['We'])
		findDays('Th').should.eql(['Th'])
		findDays('F').should.eql(['Fr'])

		findDays('M-F').should.eql(['Mo', 'Tu', 'We', 'Th', 'Fr'])
		findDays('M-Th').should.eql(['Mo', 'Tu', 'We', 'Th'])
		findDays('T-F').should.eql(['Tu', 'We', 'Th', 'Fr'])
		findDays('M-T').should.eql(['Mo', 'Tu'])

		findDays('MTThFW').should.eql(['Mo', 'Tu', 'Th', 'Fr', 'We'])
		findDays('MTTh').should.eql(['Mo', 'Tu', 'Th'])
		findDays('ThFMT').should.eql(['Th', 'Fr', 'Mo', 'Tu'])
		findDays('ThFMT').should.not.containEql('We')

		findDays('F').should.eql(['Fr'])
		findDays('M').should.eql(['Mo'])
		findDays('M-F').should.eql(['Mo', 'Tu', 'We', 'Th', 'Fr'])
		findDays('M-Th').should.eql(['Mo', 'Tu', 'We', 'Th'])
		findDays('MF').should.eql(['Mo', 'Fr'])
		findDays('MFW').should.eql(['Mo', 'Fr', 'We'])
		findDays('MT').should.eql(['Mo', 'Tu'])
		findDays('MTF').should.eql(['Mo', 'Tu', 'Fr'])
		findDays('MTTh').should.eql(['Mo', 'Tu', 'Th'])
		findDays('MTThF').should.eql(['Mo', 'Tu', 'Th', 'Fr'])
		findDays('MTThFW').should.eql(['Mo', 'Tu', 'Th', 'Fr', 'We'])
		findDays('MTW').should.eql(['Mo', 'Tu', 'We'])
		findDays('MTWF').should.eql(['Mo', 'Tu', 'We', 'Fr'])
		findDays('MTh').should.eql(['Mo', 'Th'])
		findDays('MW').should.eql(['Mo', 'We'])
		findDays('MWF').should.eql(['Mo', 'We', 'Fr'])
		findDays('MWFT').should.eql(['Mo', 'We', 'Fr', 'Tu'])
		findDays('MWTh').should.eql(['Mo', 'We', 'Th'])
		findDays('MWThF').should.eql(['Mo', 'We', 'Th', 'Fr'])
		findDays('T').should.eql(['Tu'])
		findDays('T-F').should.eql(['Tu', 'We', 'Th', 'Fr'])
		findDays('TTh').should.eql(['Tu', 'Th'])
		findDays('TThF').should.eql(['Tu', 'Th', 'Fr'])
		findDays('TW').should.eql(['Tu', 'We'])
		findDays('TWF').should.eql(['Tu', 'We', 'Fr'])
		findDays('TWTh').should.eql(['Tu', 'We', 'Th'])
		findDays('Th').should.eql(['Th'])
		findDays('W').should.eql(['We'])
		findDays('WF').should.eql(['We', 'Fr'])
		findDays('WTh').should.eql(['We', 'Th'])
	})

	it('turns the absurd time shorthand into unambiguous 24-hour time', () => {
		findTimes('5:00-9:00').should.eql({start: 500, end: 900})
		findTimes('7:00-9:00').should.eql({start: 700, end: 900})
		findTimes('8:00-9:00').should.eql({start: 800, end: 900})

		// all day courses!
		findTimes('00-00').should.eql({start: 0, end: 2359})

		findTimes('0100-0200PM').should.eql({start: 1300, end: 1400})
		findTimes('0100-0215PM').should.eql({start: 1300, end: 1415})
		findTimes('0100-0230PM').should.eql({start: 1300, end: 1430})
		findTimes('0100-0300PM').should.eql({start: 1300, end: 1500})
		findTimes('0100-0330PM').should.eql({start: 1300, end: 1530})
		findTimes('0100-0400'  ).should.eql({start: 1300, end: 1600})
		findTimes('0100-0400PM').should.eql({start: 1300, end: 1600})
		findTimes('0100-0500PM').should.eql({start: 1300, end: 1700})

		findTimes('0110-0245PM').should.eql({start: 1310, end: 1445})
		findTimes('0110-0340PM').should.eql({start: 1310, end: 1540})

		findTimes('0115-0159PM').should.eql({start: 1315, end: 1359})
		findTimes('0115-0200PM').should.eql({start: 1315, end: 1400})
		findTimes('0115-0215PM').should.eql({start: 1315, end: 1415})
		findTimes('0115-0230PM').should.eql({start: 1315, end: 1430})
		findTimes('0115-0245PM').should.eql({start: 1315, end: 1445})
		findTimes('0115-0300PM').should.eql({start: 1315, end: 1500})

		findTimes('0120-0215PM').should.eql({start: 1320, end: 1415})
		findTimes('0120-0220PM').should.eql({start: 1320, end: 1420})
		findTimes('0120-0225PM').should.eql({start: 1320, end: 1425})
		findTimes('0120-0245PM').should.eql({start: 1320, end: 1445})
		findTimes('0120-0250PM').should.eql({start: 1320, end: 1450})
		findTimes('0120-0255PM').should.eql({start: 1320, end: 1455})
		findTimes('0120-0320PM').should.eql({start: 1320, end: 1520})
		findTimes('0120-0320'  ).should.eql({start: 1320, end: 1520})
		findTimes('0120-0330PM').should.eql({start: 1320, end: 1530})
		findTimes('0120-0350PM').should.eql({start: 1320, end: 1550})
		findTimes('0120-0355PM').should.eql({start: 1320, end: 1555})
		findTimes('0120-0420PM').should.eql({start: 1320, end: 1620})
		findTimes('0120-0450PM').should.eql({start: 1320, end: 1650})
		findTimes('0120-0520PM').should.eql({start: 1320, end: 1720})

		findTimes('0130-0230PM').should.eql({start: 1330, end: 1430})
		findTimes('0130-0300PM').should.eql({start: 1330, end: 1500})
		findTimes('0130-0330PM').should.eql({start: 1330, end: 1530})
		findTimes('0130-0400PM').should.eql({start: 1330, end: 1600})
		findTimes('0130-0430PM').should.eql({start: 1330, end: 1630})
		findTimes('0130-0530PM').should.eql({start: 1330, end: 1730})

		findTimes('0140-0440PM').should.eql({start: 1340, end: 1640})

		findTimes('0145-0245PM').should.eql({start: 1345, end: 1445})
		findTimes('0145-0300PM').should.eql({start: 1345, end: 1500})


		findTimes('0200-0245PM').should.eql({start: 1400, end: 1445})
		findTimes('0200-0255PM').should.eql({start: 1400, end: 1455})
		findTimes('0200-0300PM').should.eql({start: 1400, end: 1500})
		findTimes('0200-0320PM').should.eql({start: 1400, end: 1520})
		findTimes('0200-0325PM').should.eql({start: 1400, end: 1525})
		findTimes('0200-0330PM').should.eql({start: 1400, end: 1530})
		findTimes('0200-0335PM').should.eql({start: 1400, end: 1535})
		findTimes('0200-0340PM').should.eql({start: 1400, end: 1540})
		findTimes('0200-0400PM').should.eql({start: 1400, end: 1600})
		findTimes('0200-0430PM').should.eql({start: 1400, end: 1630})
		findTimes('0200-0500PM').should.eql({start: 1400, end: 1700})
		findTimes('0200-0600PM').should.eql({start: 1400, end: 1800})

		findTimes('0205-0255PM').should.eql({start: 1405, end: 1455})
		findTimes('0205-0335PM').should.eql({start: 1405, end: 1535})

		findTimes('0215-0310PM').should.eql({start: 1415, end: 1510})
		findTimes('0215-0315PM').should.eql({start: 1415, end: 1515})
		findTimes('0215-0335PM').should.eql({start: 1415, end: 1535})
		findTimes('0215-0405PM').should.eql({start: 1415, end: 1605})
		findTimes('0215-0415PM').should.eql({start: 1415, end: 1615})
		findTimes('0215-0445PM').should.eql({start: 1415, end: 1645})
		findTimes('0215-0445  ').should.eql({start: 1415, end: 1645})
		findTimes('0215-0500PM').should.eql({start: 1415, end: 1700})
		findTimes('0215-0505PM').should.eql({start: 1415, end: 1705})
		findTimes('0215-0515PM').should.eql({start: 1415, end: 1715})

		findTimes('0220-0520PM').should.eql({start: 1420, end: 1720})

		findTimes('0225-0315PM').should.eql({start: 1425, end: 1515})
		findTimes('0225-0455PM').should.eql({start: 1425, end: 1655})

		findTimes('0230-0325PM').should.eql({start: 1430, end: 1525})
		findTimes('0230-0330PM').should.eql({start: 1430, end: 1530})
		findTimes('0230-0400PM').should.eql({start: 1430, end: 1600})
		findTimes('0230-0415PM').should.eql({start: 1430, end: 1615})
		findTimes('0230-0430PM').should.eql({start: 1430, end: 1630})
		findTimes('0230-0500PM').should.eql({start: 1430, end: 1700})
		findTimes('0230-0530PM').should.eql({start: 1430, end: 1730})

		findTimes('0240-0335PM').should.eql({start: 1440, end: 1535})

		findTimes('0255-0340PM').should.eql({start: 1455, end: 1540})
		findTimes('0256-0340PM').should.eql({start: 1456, end: 1540})


		findTimes('0300-0400PM').should.eql({start: 1500, end: 1600})
		findTimes('0300-0430PM').should.eql({start: 1500, end: 1630})
		findTimes('0300-0500PM').should.eql({start: 1500, end: 1700})
		findTimes('0300-0530PM').should.eql({start: 1500, end: 1730})
		findTimes('0300-0600PM').should.eql({start: 1500, end: 1800})

		findTimes('0305-0400PM').should.eql({start: 1505, end: 1600})
		findTimes('0305-0405PM').should.eql({start: 1505, end: 1605})
		findTimes('0305-0415PM').should.eql({start: 1505, end: 1615})
		findTimes('0305-0430PM').should.eql({start: 1505, end: 1630})

		findTimes('0310-0415PM').should.eql({start: 1510, end: 1615})
		findTimes('0310-0420PM').should.eql({start: 1510, end: 1620})

		findTimes('0315-0415PM').should.eql({start: 1515, end: 1615})
		findTimes('0315-0445PM').should.eql({start: 1515, end: 1645})
		findTimes('0315-0515PM').should.eql({start: 1515, end: 1715})

		findTimes('0320-0415PM').should.eql({start: 1520, end: 1615})
		findTimes('0320-0420PM').should.eql({start: 1520, end: 1620})

		findTimes('0330-0425PM').should.eql({start: 1530, end: 1625})
		findTimes('0330-0430PM').should.eql({start: 1530, end: 1630})
		findTimes('0330-0500PM').should.eql({start: 1530, end: 1700})
		findTimes('0330-0530PM').should.eql({start: 1530, end: 1730})
		findTimes('0330-0600PM').should.eql({start: 1530, end: 1800})

		findTimes('0335-0530PM').should.eql({start: 1535, end: 1730})
		findTimes('0335-0605PM').should.eql({start: 1535, end: 1805})

		findTimes('0340-0610PM').should.eql({start: 1540, end: 1810})

		findTimes('0345-0455PM').should.eql({start: 1545, end: 1655})
		findTimes('0345-0515PM').should.eql({start: 1545, end: 1715})
		findTimes('0345-0545PM').should.eql({start: 1545, end: 1745})

		findTimes('0350-0450PM').should.eql({start: 1550, end: 1650})

		findTimes('0355-0450PM').should.eql({start: 1555, end: 1650})
		findTimes('0355-0515PM').should.eql({start: 1555, end: 1715})


		findTimes('0400-0500PM').should.eql({start: 1600, end: 1700})
		findTimes('0400-0530PM').should.eql({start: 1600, end: 1730})
		findTimes('0400-0600PM').should.eql({start: 1600, end: 1800})

		findTimes('0405-0530PM').should.eql({start: 1605, end: 1730})

		findTimes('0430-0530PM').should.eql({start: 1630, end: 1730})
		findTimes('0430-0600PM').should.eql({start: 1630, end: 1800})

		findTimes('0450-0545PM').should.eql({start: 1650, end: 1745})
		findTimes('0450-0600PM').should.eql({start: 1650, end: 1800})
		findTimes('0450-0615PM').should.eql({start: 1650, end: 1815})


		findTimes('0500-0600PM').should.eql({start: 1700, end: 1800})
		findTimes('0500-0730PM').should.eql({start: 1700, end: 1930})

		findTimes('0505-0615PM').should.eql({start: 1705, end: 1815})

		findTimes('0530-0630PM').should.eql({start: 1730, end: 1830})


		findTimes('0600-0655PM').should.eql({start: 1800, end: 1855})
		findTimes('0600-0700PM').should.eql({start: 1800, end: 1900})
		findTimes('0600-0730PM').should.eql({start: 1800, end: 1930})
		findTimes('0600-0800PM').should.eql({start: 1800, end: 2000})
		findTimes('0600-0830PM').should.eql({start: 1800, end: 2030})
		findTimes('0600-0900PM').should.eql({start: 1800, end: 2100})
		findTimes('0600-1000PM').should.eql({start: 1800, end: 2200})

		findTimes('0630-0730PM').should.eql({start: 1830, end: 1930})
		findTimes('0630-0800PM').should.eql({start: 1830, end: 2000})
		findTimes('0630-0830PM').should.eql({start: 1830, end: 2030})
		findTimes('0630-0900PM').should.eql({start: 1830, end: 2100})
		findTimes('0630-0930PM').should.eql({start: 1830, end: 2130})

		findTimes('0645-0745').should.eql({start: 1845, end: 1945})
		findTimes('0645-0745PM').should.eql({start: 1845, end: 1945})


		findTimes('0700-0230PM').should.eql({start: 700, end: 1430})
		findTimes('0700-0300PM').should.eql({start: 700, end: 1500})
		findTimes('0700-0330PM').should.eql({start: 700, end: 1530})
		findTimes('0700-0755PM').should.eql({start: 1900, end: 1955})
		findTimes('0700-0800').should.eql({start: 1900, end: 2000})
		findTimes('0700-0800PM').should.eql({start: 1900, end: 2000})
		findTimes('0700-0830PM').should.eql({start: 1900, end: 2030})
		findTimes('0700-0900').should.eql({start: 700, end: 900})
		findTimes('0700-0900PM').should.eql({start: 1900, end: 2100})
		findTimes('0700-0930PM').should.eql({start: 1900, end: 2130})
		findTimes('0700-1000PM').should.eql({start: 1900, end: 2200})
		findTimes('0700-1230PM').should.eql({start: 700, end: 1230})

		findTimes('0730-0100PM').should.eql({start: 730, end: 1300})
		findTimes('0730-0230PM').should.eql({start: 730, end: 1430})
		findTimes('0730-0330PM').should.eql({start: 730, end: 1530})
		findTimes('0730-0400PM').should.eql({start: 730, end: 1600})
		findTimes('0730-0900PM').should.eql({start: 1930, end: 2100})
		findTimes('0730-0925').should.eql({start: 730, end: 925})
		findTimes('0730-0930PM').should.eql({start: 1930, end: 2130})
		findTimes('0730-1000').should.eql({start: 730, end: 1000})
		findTimes('0730-1000PM').should.eql({start: 1930, end: 2200})
		findTimes('0730-1200PM').should.eql({start: 730, end: 1200})


		findTimes('0800-0100PM').should.eql({start: 800, end: 1300})
		findTimes('0800-0400PM').should.eql({start: 800, end: 1600})
		findTimes('0800-0850').should.eql({start: 800, end: 850})
		findTimes('0800-0855').should.eql({start: 800, end: 855})
		findTimes('0800-0900').should.eql({start: 800, end: 900})
		findTimes('0800-0900PM').should.eql({start: 2000, end: 2100})
		findTimes('0800-0905').should.eql({start: 800, end: 905})
		findTimes('0800-0920').should.eql({start: 800, end: 920})
		findTimes('0800-0925').should.eql({start: 800, end: 925})
		findTimes('0800-0930').should.eql({start: 800, end: 930})
		findTimes('0800-0935').should.eql({start: 800, end: 935})
		findTimes('0800-1000').should.eql({start: 800, end: 1000})
		findTimes('0800-1000PM').should.eql({start: 2000, end: 2200})
		findTimes('0800-1030').should.eql({start: 800, end: 1030})
		findTimes('0800-1050').should.eql({start: 800, end: 1050})
		findTimes('0800-1100').should.eql({start: 800, end: 1100})
		findTimes('0800-1130').should.eql({start: 800, end: 1130})
		findTimes('0800-1200').should.eql({start: 800, end: 1200})
		findTimes('0800-1200PM').should.eql({start: 800, end: 1200})

		findTimes('0820-1050').should.eql({start: 820, end: 1050})

		findTimes('0825-0920').should.eql({start: 825, end: 920})

		findTimes('0830-0300PM').should.eql({start: 830, end: 1500})
		findTimes('0830-0925').should.eql({start: 830, end: 925})
		findTimes('0830-1000').should.eql({start: 830, end: 1000})
		findTimes('0830-1100').should.eql({start: 830, end: 1100})

		findTimes('0845-1000').should.eql({start: 845, end: 1000})

		findTimes('0850-1050').should.eql({start: 850, end: 1050})

		findTimes('0855-0950').should.eql({start: 855, end: 950})


		findTimes('0900-0100PM').should.eql({start: 900, end: 1300})
		findTimes('0900-0200PM').should.eql({start: 900, end: 1400})
		findTimes('0900-0300PM').should.eql({start: 900, end: 1500})
		findTimes('0900-0330PM').should.eql({start: 900, end: 1530})
		findTimes('0900-0400PM').should.eql({start: 900, end: 1600})
		findTimes('0900-0500PM').should.eql({start: 900, end: 1700})
		findTimes('0900-0955').should.eql({start: 900, end: 955})
		findTimes('0900-1000').should.eql({start: 900, end: 1000})
		findTimes('0900-1000PM').should.eql({start: 2100, end: 2200})
		findTimes('0900-1050').should.eql({start: 900, end: 1050})
		findTimes('0900-1100').should.eql({start: 900, end: 1100})
		findTimes('0900-1200PM').should.eql({start: 900, end: 1200})
		findTimes('0900-1215PM').should.eql({start: 900, end: 1215})
		findTimes('0900-1230PM').should.eql({start: 900, end: 1230})

		findTimes('0905-1000').should.eql({start: 905, end: 1000})
		findTimes('0905-1140').should.eql({start: 905, end: 1140})

		findTimes('0915-1115').should.eql({start: 915, end: 1115})

		findTimes('0930-1025').should.eql({start: 930, end: 1025})
		findTimes('0930-1030').should.eql({start: 930, end: 1030})
		findTimes('0930-1045').should.eql({start: 930, end: 1045})
		findTimes('0930-1050').should.eql({start: 930, end: 1050})
		findTimes('0930-1100').should.eql({start: 930, end: 1100})

		findTimes('0935-1030').should.eql({start: 935, end: 1030})
		findTimes('0935-1035').should.eql({start: 935, end: 1035})
		findTimes('0935-1050').should.eql({start: 935, end: 1050})
		findTimes('0935-1100').should.eql({start: 935, end: 1100})
		findTimes('0935-1110').should.eql({start: 935, end: 1110})

		findTimes('0955-1050').should.eql({start: 955, end: 1050})


		findTimes('1000-1055').should.eql({start: 1000, end: 1055})
		findTimes('1000-1130').should.eql({start: 1000, end: 1130})
		findTimes('1000-1200').should.eql({start: 1000, end: 1200})
		findTimes('1000-1200PM').should.eql({start: 1000, end: 1200})
		findTimes('1000-1230PM').should.eql({start: 1000, end: 1230})

		findTimes('1005-1100').should.eql({start: 1005, end: 1100})

		findTimes('1010-1100').should.eql({start: 1010, end: 1100})

		findTimes('1030-1145').should.eql({start: 1030, end: 1145})
		findTimes('1030-1200PM').should.eql({start: 1030, end: 1200})
		findTimes('1030-1230PM').should.eql({start: 1030, end: 1230})

		findTimes('1040-0100PM').should.eql({start: 1040, end: 1300})
		findTimes('1040-0110PM').should.eql({start: 1040, end: 1310})
		findTimes('1040-0200PM').should.eql({start: 1040, end: 1400})
		findTimes('1040-0300PM').should.eql({start: 1040, end: 1500})
		findTimes('1040-0330PM').should.eql({start: 1040, end: 1530})
		findTimes('1040-0500PM').should.eql({start: 1040, end: 1700})
		findTimes('1040-1130').should.eql({start: 1040, end: 1130})
		findTimes('1040-1135').should.eql({start: 1040, end: 1135})
		findTimes('1040-1140').should.eql({start: 1040, end: 1140})
		findTimes('1040-1150').should.eql({start: 1040, end: 1150})
		findTimes('1040-1200').should.eql({start: 1040, end: 1200})
		findTimes('1040-1200PM').should.eql({start: 1040, end: 1200})
		findTimes('1040-1210PM').should.eql({start: 1040, end: 1210})
		findTimes('1040-1215PM').should.eql({start: 1040, end: 1215})
		findTimes('1040-1220PM').should.eql({start: 1040, end: 1220})
		findTimes('1040-1230PM').should.eql({start: 1040, end: 1230})
		findTimes('1040-1240PM').should.eql({start: 1040, end: 1240})

		findTimes('1045-0100PM').should.eql({start: 1045, end: 1300})
		findTimes('1045-0115PM').should.eql({start: 1045, end: 1315})
		findTimes('1045-0145PM').should.eql({start: 1045, end: 1345})
		findTimes('1045-1135').should.eql({start: 1045, end: 1135})
		findTimes('1045-1140').should.eql({start: 1045, end: 1140})
		findTimes('1045-1145').should.eql({start: 1045, end: 1145})
		findTimes('1045-1150').should.eql({start: 1045, end: 1150})
		findTimes('1045-1200PM').should.eql({start: 1045, end: 1200})
		findTimes('1045-1215PM').should.eql({start: 1045, end: 1215})
		findTimes('1045-1230PM').should.eql({start: 1045, end: 1230})
		findTimes('1045-1245PM').should.eql({start: 1045, end: 1245})
		findTimes('1045-1345PM').should.eql({start: 1045, end: 1345})

		findTimes('1050-1220PM').should.eql({start: 1050, end: 1220})


		findTimes('1100-0130PM').should.eql({start: 1100, end: 1330})
		findTimes('1100-0200PM').should.eql({start: 1100, end: 1400})
		findTimes('1100-1200PM').should.eql({start: 1100, end: 1200})

		findTimes('1110-1240PM').should.eql({start: 1110, end: 1240})

		findTimes('1125-0245PM').should.eql({start: 1125, end: 1445})

		findTimes('1130-0130PM').should.eql({start: 1130, end: 1330})
		findTimes('1130-0200PM').should.eql({start: 1130, end: 1400})
		findTimes('1130-0230PM').should.eql({start: 1130, end: 1430})

		findTimes('1140-1230PM').should.eql({start: 1140, end: 1230})
		findTimes('1140-1240PM').should.eql({start: 1140, end: 1240})

		findTimes('1145-0100PM').should.eql({start: 1145, end: 1300})
		findTimes('1145-0110PM').should.eql({start: 1145, end: 1310})
		findTimes('1145-0115PM').should.eql({start: 1145, end: 1315})
		findTimes('1145-0120PM').should.eql({start: 1145, end: 1320})
		findTimes('1145-0145PM').should.eql({start: 1145, end: 1345})
		findTimes('1145-0200PM').should.eql({start: 1145, end: 1400})
		findTimes('1145-0215PM').should.eql({start: 1145, end: 1415})
		findTimes('1145-0245').should.eql({start: 1145, end: 1445})
		findTimes('1145-0245PM').should.eql({start: 1145, end: 1445})
		findTimes('1145-0345PM').should.eql({start: 1145, end: 1545})
		findTimes('1145-1240').should.eql({start: 1145, end: 1240})
		findTimes('1145-1240PM').should.eql({start: 1145, end: 1240})
		findTimes('1145-1245PM').should.eql({start: 1145, end: 1245})
		findTimes('1145-1250PM').should.eql({start: 1145, end: 1250})

		findTimes('1150-0110PM').should.eql({start: 1150, end: 1310})
		findTimes('1150-0150PM').should.eql({start: 1150, end: 1350})
		findTimes('1150-0220PM').should.eql({start: 1150, end: 1420})
		findTimes('1150-0250PM').should.eql({start: 1150, end: 1450})
		findTimes('1150-0255PM').should.eql({start: 1150, end: 1455})
		findTimes('1150-0350PM').should.eql({start: 1150, end: 1550})
		findTimes('1150-1240PM').should.eql({start: 1150, end: 1240})
		findTimes('1150-1245PM').should.eql({start: 1150, end: 1245})
		findTimes('1150-1255PM').should.eql({start: 1150, end: 1255})

		findTimes('1155-1250PM').should.eql({start: 1155, end: 1250})


		findTimes('1200-0100PM').should.eql({start: 1200, end: 1300})
		findTimes('1200-0150PM').should.eql({start: 1200, end: 1350})
		findTimes('1200-0200PM').should.eql({start: 1200, end: 1400})
		findTimes('1200-0230PM').should.eql({start: 1200, end: 1430})
		findTimes('1200-0300PM').should.eql({start: 1200, end: 1500})
		findTimes('1200-0400PM').should.eql({start: 1200, end: 1600})

		findTimes('1215-0245PM').should.eql({start: 1215, end: 1445})

		findTimes('1220-0150PM').should.eql({start: 1220, end: 1350})
		findTimes('1220-0250PM').should.eql({start: 1220, end: 1450})

		findTimes('1230-0100PM').should.eql({start: 1230, end: 1300})
		findTimes('1230-0200PM').should.eql({start: 1230, end: 1400})
		findTimes('1230-0230PM').should.eql({start: 1230, end: 1430})
		findTimes('1230-0300PM').should.eql({start: 1230, end: 1500})
		findTimes('1230-0330PM').should.eql({start: 1230, end: 1530})
		findTimes('1230-0400PM').should.eql({start: 1230, end: 1600})
		findTimes('1230-0430PM').should.eql({start: 1230, end: 1630})

		findTimes('1235-0235PM').should.eql({start: 1235, end: 1435})

		findTimes('1240-0330PM').should.eql({start: 1240, end: 1530})
		findTimes('1240-0340PM').should.eql({start: 1240, end: 1540})

		findTimes('1245-0105PM').should.eql({start: 1245, end: 1305})
		findTimes('1245-0140PM').should.eql({start: 1245, end: 1340})
		findTimes('1245-0145PM').should.eql({start: 1245, end: 1345})
		findTimes('1245-0205PM').should.eql({start: 1245, end: 1405})
		findTimes('1245-0215PM').should.eql({start: 1245, end: 1415})
		findTimes('1245-0230PM').should.eql({start: 1245, end: 1430})
		findTimes('1245-0245PM').should.eql({start: 1245, end: 1445})
		findTimes('1245-0300PM').should.eql({start: 1245, end: 1500})
		findTimes('1245-0315PM').should.eql({start: 1245, end: 1515})
		findTimes('1245-0335PM').should.eql({start: 1245, end: 1535})
		findTimes('1245-0345PM').should.eql({start: 1245, end: 1545})
		findTimes('1245-1545PM').should.eql({start: 1245, end: 1545})

		findTimes('1250-0320PM').should.eql({start: 1250, end: 1520})
		findTimes('1250-0350PM').should.eql({start: 1250, end: 1550})

		findTimes('1255-0110PM').should.eql({start: 1255, end: 1310})
		findTimes('1255-0140PM').should.eql({start: 1255, end: 1340})
		findTimes('1255-0145PM').should.eql({start: 1255, end: 1345})
		findTimes('1255-0150PM').should.eql({start: 1255, end: 1350})
		findTimes('1255-0155PM').should.eql({start: 1255, end: 1355})
		findTimes('1255-0200PM').should.eql({start: 1255, end: 1400})
		findTimes('1255-0230PM').should.eql({start: 1255, end: 1430})
		findTimes('1255-0235PM').should.eql({start: 1255, end: 1435})
		findTimes('1255-0255PM').should.eql({start: 1255, end: 1455})
		findTimes('1255-0300PM').should.eql({start: 1255, end: 1500})
		findTimes('1255-0325PM').should.eql({start: 1255, end: 1525})
		findTimes('1255-0355PM').should.eql({start: 1255, end: 1555})
		findTimes('1255-0500PM').should.eql({start: 1255, end: 1700})
		findTimes('1255-1350PM').should.eql({start: 1255, end: 1350})
		findTimes('1255-1355PM').should.eql({start: 1255, end: 1355})
		findTimes('1255-1555PM').should.eql({start: 1255, end: 1555})

		findTimes('1:00-3:00PM').should.eql({start: 1300, end: 1500})
		findTimes('8:00-9:25').should.eql({start: 800, end: 925})
	})

	it('turns the timestrings into semi-usable objects', () => {
		let courses = [
			{times: ['MT 0100-0400PM', 'MF 0905-1000']},
			{times: ['M-Th 0100-0200PM', 'MF 0905-1000']},
		]

		convertTimeStringsToOfferings(courses[0]).should.eql([
			{day: 'Mo', times:[{start:1300, end:1600}, {start:905, end:1000}]},
			{day: 'Tu', times:[{start:1300, end:1600}]},
			{day: 'Fr', times:[{start:905, end:1000}]},
		])
		convertTimeStringsToOfferings(courses[1]).should.eql([
			{day: 'Mo', times:[{start:1300, end:1400}, {start:905, end:1000}]},
			{day: 'Tu', times:[{start:1300, end:1400}]},
			{day: 'We', times:[{start:1300, end:1400}]},
			{day: 'Th', times:[{start:1300, end:1400}]},
			{day: 'Fr', times:[{start:905, end:1000}]},
		])
	})

	it('checks for course time conflicts', () => {
		let courses = [
			{offerings: [
				{day: 'Mo', times:[{start:1300, end:1600}, {start:905, end:1000}]},
				{day: 'Tu', times:[{start:1300, end:1600}]},
				{day: 'Fr', times:[{start:905, end:1000}]},
			]},
			{offerings: [
				{day: 'Mo', times:[{start:1300, end:1400}, {start:905, end:1000}]},
				{day: 'Tu', times:[{start:1300, end:1400}]},
				{day: 'We', times:[{start:1300, end:1400}]},
				{day: 'Th', times:[{start:1300, end:1400}]},
				{day: 'Fr', times:[{start:905, end:1000}]},
			]},
			{offerings: [
				{day: 'Mo', times:[{start:400, end:600}]},
			]},
		]

		checkCourseTimeConflicts(courses[0], courses[1]).should.be.true

		checkCourseTimeConflicts(courses[0], courses[2]).should.be.false
		checkCourseTimeConflicts(courses[1], courses[2]).should.be.false

		let testing = [
			{offerings: convertTimeStringsToOfferings({times: ['M 1255-0325PM']})},
			{offerings: convertTimeStringsToOfferings({times: ['MWF 0200-0255PM']})},
		]

		checkCourseTimeConflicts(testing[0], testing[1]).should.be.true
		checkCourseTimeConflicts(testing[1], testing[0]).should.be.true
	})
})
