import test from 'ava'
import toPrettyTerm from '../to-pretty-term'

test('converts a term id to a year and semester', t => {
	t.is(toPrettyTerm(20141), 'Fall 2014—2015')
	t.is(toPrettyTerm(20103), 'Spring 2010—2011')
	t.is(toPrettyTerm(20135), 'Summer Session 2 2013—2014')
	t.is(toPrettyTerm(20111), 'Fall 2011—2012')
	t.is(toPrettyTerm(20316), 'Unknown (6) 2031—2032')
	t.is(toPrettyTerm(20134), 'Summer Session 1 2013—2014')
})
