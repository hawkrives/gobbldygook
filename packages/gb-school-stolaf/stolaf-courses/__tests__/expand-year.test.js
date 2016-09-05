import test from 'ava'
import expandYear from '../expand-year'

test('expands a year to year-(year+1)', t => {
	t.is(expandYear(2014), '2014—2015')
	t.is(expandYear(2010), '2010—2011')
	t.is(expandYear(2013), '2013—2014')
	t.is(expandYear(2011), '2011—2012')
	t.is(expandYear(2031), '2031—2032')
	t.is(expandYear(2013), '2013—2014')
})

test('can also do short expansions', t => {
	t.is(expandYear(2014, true), '2014—15')
	t.is(expandYear(2010, true), '2010—11')
	t.is(expandYear(2013, true), '2013—14')
	t.is(expandYear(2011, true), '2011—12')
	t.is(expandYear(2031, true), '2031—32')
	t.is(expandYear(2013, true), '2013—14')
})

test('can switch out the seperator char', t => {
	t.is(expandYear(2014, false, '–'), '2014–2015')
	t.is(expandYear(2010, true, '·'), '2010·11')
	t.is(expandYear(2013, false, '-'), '2013-2014')
	t.is(expandYear(2011, true, '/'), '2011/12')
	t.is(expandYear(2031, false, '+'), '2031+2032')
	t.is(expandYear(2013, true, '¿'), '2013¿14')
})
