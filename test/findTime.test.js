// test/findTime.test.js
import findTime from '../lib/findTime'

describe('findTime', () => {
	it('turns the absurd time shorthand into unambiguous 24-hour time', () => {
		expect(findTime('0200-0400PM')).to.eql({start: 1400, end: 1600})
	})

	it('handles times with colons', () => {
		expect(findTime('5:00-9:00')).to.eql({start: 500, end: 900})
		expect(findTime('7:00-9:00')).to.eql({start: 700, end: 900})
		expect(findTime('8:00-9:00')).to.eql({start: 800, end: 900})

		expect(findTime('1:00-3:00PM')).to.eql({start: 1300, end: 1500})
		expect(findTime('8:00-9:25')).to.eql({start: 800, end: 925})
	})

	it('handles all-day times', () => {
		expect(findTime('00-00')).to.eql({start: 0, end: 2359})
	})

	it('handles both courses that should and courses that do end in the afternoon', () => {
		expect(findTime('0100-0400')).to.eql({start: 1300, end: 1600})
		expect(findTime('0100-0400PM')).to.eql({start: 1300, end: 1600})
	})

	it('handles every variant that the SIS contains', () => {
		expect(findTime('5:00-9:00')).to.eql({start: 500, end: 900})
		expect(findTime('7:00-9:00')).to.eql({start: 700, end: 900})
		expect(findTime('8:00-9:00')).to.eql({start: 800, end: 900})

		// all day courses!
		expect(findTime('00-00')).to.eql({start: 0, end: 2359})

		expect(findTime('0100-0200PM')).to.eql({start: 1300, end: 1400})
		expect(findTime('0100-0215PM')).to.eql({start: 1300, end: 1415})
		expect(findTime('0100-0230PM')).to.eql({start: 1300, end: 1430})
		expect(findTime('0100-0300PM')).to.eql({start: 1300, end: 1500})
		expect(findTime('0100-0330PM')).to.eql({start: 1300, end: 1530})
		expect(findTime('0100-0400'  )).to.eql({start: 1300, end: 1600})
		expect(findTime('0100-0400PM')).to.eql({start: 1300, end: 1600})
		expect(findTime('0100-0500PM')).to.eql({start: 1300, end: 1700})

		expect(findTime('0110-0245PM')).to.eql({start: 1310, end: 1445})
		expect(findTime('0110-0340PM')).to.eql({start: 1310, end: 1540})

		expect(findTime('0115-0159PM')).to.eql({start: 1315, end: 1359})
		expect(findTime('0115-0200PM')).to.eql({start: 1315, end: 1400})
		expect(findTime('0115-0215PM')).to.eql({start: 1315, end: 1415})
		expect(findTime('0115-0230PM')).to.eql({start: 1315, end: 1430})
		expect(findTime('0115-0245PM')).to.eql({start: 1315, end: 1445})
		expect(findTime('0115-0300PM')).to.eql({start: 1315, end: 1500})

		expect(findTime('0120-0215PM')).to.eql({start: 1320, end: 1415})
		expect(findTime('0120-0220PM')).to.eql({start: 1320, end: 1420})
		expect(findTime('0120-0225PM')).to.eql({start: 1320, end: 1425})
		expect(findTime('0120-0245PM')).to.eql({start: 1320, end: 1445})
		expect(findTime('0120-0250PM')).to.eql({start: 1320, end: 1450})
		expect(findTime('0120-0255PM')).to.eql({start: 1320, end: 1455})
		expect(findTime('0120-0320PM')).to.eql({start: 1320, end: 1520})
		expect(findTime('0120-0320'  )).to.eql({start: 1320, end: 1520})
		expect(findTime('0120-0330PM')).to.eql({start: 1320, end: 1530})
		expect(findTime('0120-0350PM')).to.eql({start: 1320, end: 1550})
		expect(findTime('0120-0355PM')).to.eql({start: 1320, end: 1555})
		expect(findTime('0120-0420PM')).to.eql({start: 1320, end: 1620})
		expect(findTime('0120-0450PM')).to.eql({start: 1320, end: 1650})
		expect(findTime('0120-0520PM')).to.eql({start: 1320, end: 1720})

		expect(findTime('0130-0230PM')).to.eql({start: 1330, end: 1430})
		expect(findTime('0130-0300PM')).to.eql({start: 1330, end: 1500})
		expect(findTime('0130-0330PM')).to.eql({start: 1330, end: 1530})
		expect(findTime('0130-0400PM')).to.eql({start: 1330, end: 1600})
		expect(findTime('0130-0430PM')).to.eql({start: 1330, end: 1630})
		expect(findTime('0130-0530PM')).to.eql({start: 1330, end: 1730})

		expect(findTime('0140-0440PM')).to.eql({start: 1340, end: 1640})

		expect(findTime('0145-0245PM')).to.eql({start: 1345, end: 1445})
		expect(findTime('0145-0300PM')).to.eql({start: 1345, end: 1500})


		expect(findTime('0200-0245PM')).to.eql({start: 1400, end: 1445})
		expect(findTime('0200-0255PM')).to.eql({start: 1400, end: 1455})
		expect(findTime('0200-0300PM')).to.eql({start: 1400, end: 1500})
		expect(findTime('0200-0320PM')).to.eql({start: 1400, end: 1520})
		expect(findTime('0200-0325PM')).to.eql({start: 1400, end: 1525})
		expect(findTime('0200-0330PM')).to.eql({start: 1400, end: 1530})
		expect(findTime('0200-0335PM')).to.eql({start: 1400, end: 1535})
		expect(findTime('0200-0340PM')).to.eql({start: 1400, end: 1540})
		expect(findTime('0200-0400PM')).to.eql({start: 1400, end: 1600})
		expect(findTime('0200-0430PM')).to.eql({start: 1400, end: 1630})
		expect(findTime('0200-0500PM')).to.eql({start: 1400, end: 1700})
		expect(findTime('0200-0600PM')).to.eql({start: 1400, end: 1800})

		expect(findTime('0205-0255PM')).to.eql({start: 1405, end: 1455})
		expect(findTime('0205-0335PM')).to.eql({start: 1405, end: 1535})

		expect(findTime('0215-0310PM')).to.eql({start: 1415, end: 1510})
		expect(findTime('0215-0315PM')).to.eql({start: 1415, end: 1515})
		expect(findTime('0215-0335PM')).to.eql({start: 1415, end: 1535})
		expect(findTime('0215-0405PM')).to.eql({start: 1415, end: 1605})
		expect(findTime('0215-0415PM')).to.eql({start: 1415, end: 1615})
		expect(findTime('0215-0445PM')).to.eql({start: 1415, end: 1645})
		expect(findTime('0215-0445  ')).to.eql({start: 1415, end: 1645})
		expect(findTime('0215-0500PM')).to.eql({start: 1415, end: 1700})
		expect(findTime('0215-0505PM')).to.eql({start: 1415, end: 1705})
		expect(findTime('0215-0515PM')).to.eql({start: 1415, end: 1715})

		expect(findTime('0220-0520PM')).to.eql({start: 1420, end: 1720})

		expect(findTime('0225-0315PM')).to.eql({start: 1425, end: 1515})
		expect(findTime('0225-0455PM')).to.eql({start: 1425, end: 1655})

		expect(findTime('0230-0325PM')).to.eql({start: 1430, end: 1525})
		expect(findTime('0230-0330PM')).to.eql({start: 1430, end: 1530})
		expect(findTime('0230-0400PM')).to.eql({start: 1430, end: 1600})
		expect(findTime('0230-0415PM')).to.eql({start: 1430, end: 1615})
		expect(findTime('0230-0430PM')).to.eql({start: 1430, end: 1630})
		expect(findTime('0230-0500PM')).to.eql({start: 1430, end: 1700})
		expect(findTime('0230-0530PM')).to.eql({start: 1430, end: 1730})

		expect(findTime('0240-0335PM')).to.eql({start: 1440, end: 1535})

		expect(findTime('0255-0340PM')).to.eql({start: 1455, end: 1540})
		expect(findTime('0256-0340PM')).to.eql({start: 1456, end: 1540})


		expect(findTime('0300-0400PM')).to.eql({start: 1500, end: 1600})
		expect(findTime('0300-0430PM')).to.eql({start: 1500, end: 1630})
		expect(findTime('0300-0500PM')).to.eql({start: 1500, end: 1700})
		expect(findTime('0300-0530PM')).to.eql({start: 1500, end: 1730})
		expect(findTime('0300-0600PM')).to.eql({start: 1500, end: 1800})

		expect(findTime('0305-0400PM')).to.eql({start: 1505, end: 1600})
		expect(findTime('0305-0405PM')).to.eql({start: 1505, end: 1605})
		expect(findTime('0305-0415PM')).to.eql({start: 1505, end: 1615})
		expect(findTime('0305-0430PM')).to.eql({start: 1505, end: 1630})

		expect(findTime('0310-0415PM')).to.eql({start: 1510, end: 1615})
		expect(findTime('0310-0420PM')).to.eql({start: 1510, end: 1620})

		expect(findTime('0315-0415PM')).to.eql({start: 1515, end: 1615})
		expect(findTime('0315-0445PM')).to.eql({start: 1515, end: 1645})
		expect(findTime('0315-0515PM')).to.eql({start: 1515, end: 1715})

		expect(findTime('0320-0415PM')).to.eql({start: 1520, end: 1615})
		expect(findTime('0320-0420PM')).to.eql({start: 1520, end: 1620})

		expect(findTime('0330-0425PM')).to.eql({start: 1530, end: 1625})
		expect(findTime('0330-0430PM')).to.eql({start: 1530, end: 1630})
		expect(findTime('0330-0500PM')).to.eql({start: 1530, end: 1700})
		expect(findTime('0330-0530PM')).to.eql({start: 1530, end: 1730})
		expect(findTime('0330-0600PM')).to.eql({start: 1530, end: 1800})

		expect(findTime('0335-0530PM')).to.eql({start: 1535, end: 1730})
		expect(findTime('0335-0605PM')).to.eql({start: 1535, end: 1805})

		expect(findTime('0340-0610PM')).to.eql({start: 1540, end: 1810})

		expect(findTime('0345-0455PM')).to.eql({start: 1545, end: 1655})
		expect(findTime('0345-0515PM')).to.eql({start: 1545, end: 1715})
		expect(findTime('0345-0545PM')).to.eql({start: 1545, end: 1745})

		expect(findTime('0350-0450PM')).to.eql({start: 1550, end: 1650})

		expect(findTime('0355-0450PM')).to.eql({start: 1555, end: 1650})
		expect(findTime('0355-0515PM')).to.eql({start: 1555, end: 1715})


		expect(findTime('0400-0500PM')).to.eql({start: 1600, end: 1700})
		expect(findTime('0400-0530PM')).to.eql({start: 1600, end: 1730})
		expect(findTime('0400-0600PM')).to.eql({start: 1600, end: 1800})

		expect(findTime('0405-0530PM')).to.eql({start: 1605, end: 1730})

		expect(findTime('0430-0530PM')).to.eql({start: 1630, end: 1730})
		expect(findTime('0430-0600PM')).to.eql({start: 1630, end: 1800})

		expect(findTime('0450-0545PM')).to.eql({start: 1650, end: 1745})
		expect(findTime('0450-0600PM')).to.eql({start: 1650, end: 1800})
		expect(findTime('0450-0615PM')).to.eql({start: 1650, end: 1815})


		expect(findTime('0500-0600PM')).to.eql({start: 1700, end: 1800})
		expect(findTime('0500-0730PM')).to.eql({start: 1700, end: 1930})

		expect(findTime('0505-0615PM')).to.eql({start: 1705, end: 1815})

		expect(findTime('0530-0630PM')).to.eql({start: 1730, end: 1830})


		expect(findTime('0600-0655PM')).to.eql({start: 1800, end: 1855})
		expect(findTime('0600-0700PM')).to.eql({start: 1800, end: 1900})
		expect(findTime('0600-0730PM')).to.eql({start: 1800, end: 1930})
		expect(findTime('0600-0800PM')).to.eql({start: 1800, end: 2000})
		expect(findTime('0600-0830PM')).to.eql({start: 1800, end: 2030})
		expect(findTime('0600-0900PM')).to.eql({start: 1800, end: 2100})
		expect(findTime('0600-1000PM')).to.eql({start: 1800, end: 2200})

		expect(findTime('0630-0730PM')).to.eql({start: 1830, end: 1930})
		expect(findTime('0630-0800PM')).to.eql({start: 1830, end: 2000})
		expect(findTime('0630-0830PM')).to.eql({start: 1830, end: 2030})
		expect(findTime('0630-0900PM')).to.eql({start: 1830, end: 2100})
		expect(findTime('0630-0930PM')).to.eql({start: 1830, end: 2130})

		expect(findTime('0645-0745')).to.eql({start: 1845, end: 1945})
		expect(findTime('0645-0745PM')).to.eql({start: 1845, end: 1945})


		expect(findTime('0700-0230PM')).to.eql({start: 700, end: 1430})
		expect(findTime('0700-0300PM')).to.eql({start: 700, end: 1500})
		expect(findTime('0700-0330PM')).to.eql({start: 700, end: 1530})
		expect(findTime('0700-0755PM')).to.eql({start: 1900, end: 1955})
		expect(findTime('0700-0800')).to.eql({start: 1900, end: 2000})
		expect(findTime('0700-0800PM')).to.eql({start: 1900, end: 2000})
		expect(findTime('0700-0830PM')).to.eql({start: 1900, end: 2030})
		expect(findTime('0700-0900')).to.eql({start: 700, end: 900})
		expect(findTime('0700-0900PM')).to.eql({start: 1900, end: 2100})
		expect(findTime('0700-0930PM')).to.eql({start: 1900, end: 2130})
		expect(findTime('0700-1000PM')).to.eql({start: 1900, end: 2200})
		expect(findTime('0700-1230PM')).to.eql({start: 700, end: 1230})

		expect(findTime('0730-0100PM')).to.eql({start: 730, end: 1300})
		expect(findTime('0730-0230PM')).to.eql({start: 730, end: 1430})
		expect(findTime('0730-0330PM')).to.eql({start: 730, end: 1530})
		expect(findTime('0730-0400PM')).to.eql({start: 730, end: 1600})
		expect(findTime('0730-0900PM')).to.eql({start: 1930, end: 2100})
		expect(findTime('0730-0925')).to.eql({start: 730, end: 925})
		expect(findTime('0730-0930PM')).to.eql({start: 1930, end: 2130})
		expect(findTime('0730-1000')).to.eql({start: 730, end: 1000})
		expect(findTime('0730-1000PM')).to.eql({start: 1930, end: 2200})
		expect(findTime('0730-1200PM')).to.eql({start: 730, end: 1200})


		expect(findTime('0800-0100PM')).to.eql({start: 800, end: 1300})
		expect(findTime('0800-0400PM')).to.eql({start: 800, end: 1600})
		expect(findTime('0800-0850')).to.eql({start: 800, end: 850})
		expect(findTime('0800-0855')).to.eql({start: 800, end: 855})
		expect(findTime('0800-0900')).to.eql({start: 800, end: 900})
		expect(findTime('0800-0900PM')).to.eql({start: 2000, end: 2100})
		expect(findTime('0800-0905')).to.eql({start: 800, end: 905})
		expect(findTime('0800-0920')).to.eql({start: 800, end: 920})
		expect(findTime('0800-0925')).to.eql({start: 800, end: 925})
		expect(findTime('0800-0930')).to.eql({start: 800, end: 930})
		expect(findTime('0800-0935')).to.eql({start: 800, end: 935})
		expect(findTime('0800-1000')).to.eql({start: 800, end: 1000})
		expect(findTime('0800-1000PM')).to.eql({start: 2000, end: 2200})
		expect(findTime('0800-1030')).to.eql({start: 800, end: 1030})
		expect(findTime('0800-1050')).to.eql({start: 800, end: 1050})
		expect(findTime('0800-1100')).to.eql({start: 800, end: 1100})
		expect(findTime('0800-1130')).to.eql({start: 800, end: 1130})
		expect(findTime('0800-1200')).to.eql({start: 800, end: 1200})
		expect(findTime('0800-1200PM')).to.eql({start: 800, end: 1200})

		expect(findTime('0820-1050')).to.eql({start: 820, end: 1050})

		expect(findTime('0825-0920')).to.eql({start: 825, end: 920})

		expect(findTime('0830-0300PM')).to.eql({start: 830, end: 1500})
		expect(findTime('0830-0925')).to.eql({start: 830, end: 925})
		expect(findTime('0830-1000')).to.eql({start: 830, end: 1000})
		expect(findTime('0830-1100')).to.eql({start: 830, end: 1100})

		expect(findTime('0845-1000')).to.eql({start: 845, end: 1000})

		expect(findTime('0850-1050')).to.eql({start: 850, end: 1050})

		expect(findTime('0855-0950')).to.eql({start: 855, end: 950})


		expect(findTime('0900-0100PM')).to.eql({start: 900, end: 1300})
		expect(findTime('0900-0200PM')).to.eql({start: 900, end: 1400})
		expect(findTime('0900-0300PM')).to.eql({start: 900, end: 1500})
		expect(findTime('0900-0330PM')).to.eql({start: 900, end: 1530})
		expect(findTime('0900-0400PM')).to.eql({start: 900, end: 1600})
		expect(findTime('0900-0500PM')).to.eql({start: 900, end: 1700})
		expect(findTime('0900-0955')).to.eql({start: 900, end: 955})
		expect(findTime('0900-1000')).to.eql({start: 900, end: 1000})
		expect(findTime('0900-1000PM')).to.eql({start: 2100, end: 2200})
		expect(findTime('0900-1050')).to.eql({start: 900, end: 1050})
		expect(findTime('0900-1100')).to.eql({start: 900, end: 1100})
		expect(findTime('0900-1200PM')).to.eql({start: 900, end: 1200})
		expect(findTime('0900-1215PM')).to.eql({start: 900, end: 1215})
		expect(findTime('0900-1230PM')).to.eql({start: 900, end: 1230})

		expect(findTime('0905-1000')).to.eql({start: 905, end: 1000})
		expect(findTime('0905-1140')).to.eql({start: 905, end: 1140})

		expect(findTime('0915-1115')).to.eql({start: 915, end: 1115})

		expect(findTime('0930-1025')).to.eql({start: 930, end: 1025})
		expect(findTime('0930-1030')).to.eql({start: 930, end: 1030})
		expect(findTime('0930-1045')).to.eql({start: 930, end: 1045})
		expect(findTime('0930-1050')).to.eql({start: 930, end: 1050})
		expect(findTime('0930-1100')).to.eql({start: 930, end: 1100})

		expect(findTime('0935-1030')).to.eql({start: 935, end: 1030})
		expect(findTime('0935-1035')).to.eql({start: 935, end: 1035})
		expect(findTime('0935-1050')).to.eql({start: 935, end: 1050})
		expect(findTime('0935-1100')).to.eql({start: 935, end: 1100})
		expect(findTime('0935-1110')).to.eql({start: 935, end: 1110})

		expect(findTime('0955-1050')).to.eql({start: 955, end: 1050})


		expect(findTime('1000-1055')).to.eql({start: 1000, end: 1055})
		expect(findTime('1000-1130')).to.eql({start: 1000, end: 1130})
		expect(findTime('1000-1200')).to.eql({start: 1000, end: 1200})
		expect(findTime('1000-1200PM')).to.eql({start: 1000, end: 1200})
		expect(findTime('1000-1230PM')).to.eql({start: 1000, end: 1230})

		expect(findTime('1005-1100')).to.eql({start: 1005, end: 1100})

		expect(findTime('1010-1100')).to.eql({start: 1010, end: 1100})

		expect(findTime('1030-1145')).to.eql({start: 1030, end: 1145})
		expect(findTime('1030-1200PM')).to.eql({start: 1030, end: 1200})
		expect(findTime('1030-1230PM')).to.eql({start: 1030, end: 1230})

		expect(findTime('1040-0100PM')).to.eql({start: 1040, end: 1300})
		expect(findTime('1040-0110PM')).to.eql({start: 1040, end: 1310})
		expect(findTime('1040-0200PM')).to.eql({start: 1040, end: 1400})
		expect(findTime('1040-0300PM')).to.eql({start: 1040, end: 1500})
		expect(findTime('1040-0330PM')).to.eql({start: 1040, end: 1530})
		expect(findTime('1040-0500PM')).to.eql({start: 1040, end: 1700})
		expect(findTime('1040-1130')).to.eql({start: 1040, end: 1130})
		expect(findTime('1040-1135')).to.eql({start: 1040, end: 1135})
		expect(findTime('1040-1140')).to.eql({start: 1040, end: 1140})
		expect(findTime('1040-1150')).to.eql({start: 1040, end: 1150})
		expect(findTime('1040-1200')).to.eql({start: 1040, end: 1200})
		expect(findTime('1040-1200PM')).to.eql({start: 1040, end: 1200})
		expect(findTime('1040-1210PM')).to.eql({start: 1040, end: 1210})
		expect(findTime('1040-1215PM')).to.eql({start: 1040, end: 1215})
		expect(findTime('1040-1220PM')).to.eql({start: 1040, end: 1220})
		expect(findTime('1040-1230PM')).to.eql({start: 1040, end: 1230})
		expect(findTime('1040-1240PM')).to.eql({start: 1040, end: 1240})

		expect(findTime('1045-0100PM')).to.eql({start: 1045, end: 1300})
		expect(findTime('1045-0115PM')).to.eql({start: 1045, end: 1315})
		expect(findTime('1045-0145PM')).to.eql({start: 1045, end: 1345})
		expect(findTime('1045-1135')).to.eql({start: 1045, end: 1135})
		expect(findTime('1045-1140')).to.eql({start: 1045, end: 1140})
		expect(findTime('1045-1145')).to.eql({start: 1045, end: 1145})
		expect(findTime('1045-1150')).to.eql({start: 1045, end: 1150})
		expect(findTime('1045-1200PM')).to.eql({start: 1045, end: 1200})
		expect(findTime('1045-1215PM')).to.eql({start: 1045, end: 1215})
		expect(findTime('1045-1230PM')).to.eql({start: 1045, end: 1230})
		expect(findTime('1045-1245PM')).to.eql({start: 1045, end: 1245})
		expect(findTime('1045-1345PM')).to.eql({start: 1045, end: 1345})

		expect(findTime('1050-1220PM')).to.eql({start: 1050, end: 1220})


		expect(findTime('1100-0130PM')).to.eql({start: 1100, end: 1330})
		expect(findTime('1100-0200PM')).to.eql({start: 1100, end: 1400})
		expect(findTime('1100-1200PM')).to.eql({start: 1100, end: 1200})

		expect(findTime('1110-1240PM')).to.eql({start: 1110, end: 1240})

		expect(findTime('1125-0245PM')).to.eql({start: 1125, end: 1445})

		expect(findTime('1130-0130PM')).to.eql({start: 1130, end: 1330})
		expect(findTime('1130-0200PM')).to.eql({start: 1130, end: 1400})
		expect(findTime('1130-0230PM')).to.eql({start: 1130, end: 1430})

		expect(findTime('1140-1230PM')).to.eql({start: 1140, end: 1230})
		expect(findTime('1140-1240PM')).to.eql({start: 1140, end: 1240})

		expect(findTime('1145-0100PM')).to.eql({start: 1145, end: 1300})
		expect(findTime('1145-0110PM')).to.eql({start: 1145, end: 1310})
		expect(findTime('1145-0115PM')).to.eql({start: 1145, end: 1315})
		expect(findTime('1145-0120PM')).to.eql({start: 1145, end: 1320})
		expect(findTime('1145-0145PM')).to.eql({start: 1145, end: 1345})
		expect(findTime('1145-0200PM')).to.eql({start: 1145, end: 1400})
		expect(findTime('1145-0215PM')).to.eql({start: 1145, end: 1415})
		expect(findTime('1145-0245')).to.eql({start: 1145, end: 1445})
		expect(findTime('1145-0245PM')).to.eql({start: 1145, end: 1445})
		expect(findTime('1145-0345PM')).to.eql({start: 1145, end: 1545})
		expect(findTime('1145-1240')).to.eql({start: 1145, end: 1240})
		expect(findTime('1145-1240PM')).to.eql({start: 1145, end: 1240})
		expect(findTime('1145-1245PM')).to.eql({start: 1145, end: 1245})
		expect(findTime('1145-1250PM')).to.eql({start: 1145, end: 1250})

		expect(findTime('1150-0110PM')).to.eql({start: 1150, end: 1310})
		expect(findTime('1150-0150PM')).to.eql({start: 1150, end: 1350})
		expect(findTime('1150-0220PM')).to.eql({start: 1150, end: 1420})
		expect(findTime('1150-0250PM')).to.eql({start: 1150, end: 1450})
		expect(findTime('1150-0255PM')).to.eql({start: 1150, end: 1455})
		expect(findTime('1150-0350PM')).to.eql({start: 1150, end: 1550})
		expect(findTime('1150-1240PM')).to.eql({start: 1150, end: 1240})
		expect(findTime('1150-1245PM')).to.eql({start: 1150, end: 1245})
		expect(findTime('1150-1255PM')).to.eql({start: 1150, end: 1255})

		expect(findTime('1155-1250PM')).to.eql({start: 1155, end: 1250})


		expect(findTime('1200-0100PM')).to.eql({start: 1200, end: 1300})
		expect(findTime('1200-0150PM')).to.eql({start: 1200, end: 1350})
		expect(findTime('1200-0200PM')).to.eql({start: 1200, end: 1400})
		expect(findTime('1200-0230PM')).to.eql({start: 1200, end: 1430})
		expect(findTime('1200-0300PM')).to.eql({start: 1200, end: 1500})
		expect(findTime('1200-0400PM')).to.eql({start: 1200, end: 1600})

		expect(findTime('1215-0245PM')).to.eql({start: 1215, end: 1445})

		expect(findTime('1220-0150PM')).to.eql({start: 1220, end: 1350})
		expect(findTime('1220-0250PM')).to.eql({start: 1220, end: 1450})

		expect(findTime('1230-0100PM')).to.eql({start: 1230, end: 1300})
		expect(findTime('1230-0200PM')).to.eql({start: 1230, end: 1400})
		expect(findTime('1230-0230PM')).to.eql({start: 1230, end: 1430})
		expect(findTime('1230-0300PM')).to.eql({start: 1230, end: 1500})
		expect(findTime('1230-0330PM')).to.eql({start: 1230, end: 1530})
		expect(findTime('1230-0400PM')).to.eql({start: 1230, end: 1600})
		expect(findTime('1230-0430PM')).to.eql({start: 1230, end: 1630})

		expect(findTime('1235-0235PM')).to.eql({start: 1235, end: 1435})

		expect(findTime('1240-0330PM')).to.eql({start: 1240, end: 1530})
		expect(findTime('1240-0340PM')).to.eql({start: 1240, end: 1540})

		expect(findTime('1245-0105PM')).to.eql({start: 1245, end: 1305})
		expect(findTime('1245-0140PM')).to.eql({start: 1245, end: 1340})
		expect(findTime('1245-0145PM')).to.eql({start: 1245, end: 1345})
		expect(findTime('1245-0205PM')).to.eql({start: 1245, end: 1405})
		expect(findTime('1245-0215PM')).to.eql({start: 1245, end: 1415})
		expect(findTime('1245-0230PM')).to.eql({start: 1245, end: 1430})
		expect(findTime('1245-0245PM')).to.eql({start: 1245, end: 1445})
		expect(findTime('1245-0300PM')).to.eql({start: 1245, end: 1500})
		expect(findTime('1245-0315PM')).to.eql({start: 1245, end: 1515})
		expect(findTime('1245-0335PM')).to.eql({start: 1245, end: 1535})
		expect(findTime('1245-0345PM')).to.eql({start: 1245, end: 1545})
		expect(findTime('1245-1545PM')).to.eql({start: 1245, end: 1545})

		expect(findTime('1250-0320PM')).to.eql({start: 1250, end: 1520})
		expect(findTime('1250-0350PM')).to.eql({start: 1250, end: 1550})

		expect(findTime('1255-0110PM')).to.eql({start: 1255, end: 1310})
		expect(findTime('1255-0140PM')).to.eql({start: 1255, end: 1340})
		expect(findTime('1255-0145PM')).to.eql({start: 1255, end: 1345})
		expect(findTime('1255-0150PM')).to.eql({start: 1255, end: 1350})
		expect(findTime('1255-0155PM')).to.eql({start: 1255, end: 1355})
		expect(findTime('1255-0200PM')).to.eql({start: 1255, end: 1400})
		expect(findTime('1255-0230PM')).to.eql({start: 1255, end: 1430})
		expect(findTime('1255-0235PM')).to.eql({start: 1255, end: 1435})
		expect(findTime('1255-0255PM')).to.eql({start: 1255, end: 1455})
		expect(findTime('1255-0300PM')).to.eql({start: 1255, end: 1500})
		expect(findTime('1255-0325PM')).to.eql({start: 1255, end: 1525})
		expect(findTime('1255-0355PM')).to.eql({start: 1255, end: 1555})
		expect(findTime('1255-0500PM')).to.eql({start: 1255, end: 1700})
		expect(findTime('1255-1350PM')).to.eql({start: 1255, end: 1350})
		expect(findTime('1255-1355PM')).to.eql({start: 1255, end: 1355})
		expect(findTime('1255-1555PM')).to.eql({start: 1255, end: 1555})

		expect(findTime('1:00-3:00PM')).to.eql({start: 1300, end: 1500})
		expect(findTime('8:00-9:25')).to.eql({start: 800, end: 925})
	})
})
