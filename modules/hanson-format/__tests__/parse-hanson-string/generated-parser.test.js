import { parse } from '../../parse-hanson-string'

const f = str => expect(() => parse(str, { startRule: 'Filter' })).not.toThrow()
const r = str => expect(() => parse(str, { startRule: 'Result' })).not.toThrow()
const t = (str, msg) => expect(() => parse(str)).toThrow(msg)

describe('parse-hanson-string', () => {
    it('should not throw', () => {
        f('only courses from (CSCI 121, CSCI 125)')
        f('only distinct courses from (CSCI 121, CSCI 125)')
        f('only courses where { dept = CSCI }')

        r('CSCI 121')
        r('six courses from filter')
        r('at most two courses from filter where { level = 100 }')
        r('CSCI 121 | CSCI 125')
        r('(CSCI 121 | 122) & 123')
        r('one occurrence of AMCON 201')
        r(
            'seven of (CHEM 252, 260, 298, 379, (382 & 378), 384, 386, 388, 391, 398)'
        )
        r('!AMCON 201')
        r('MATH 282.*.2014.1 | 244 | 252')
        r(
            'one-point-five credits from (Ballet, Improvisation, International and Social, Modern)'
        )
        r('none of (CSCI 121, CSCI 125)')
        r('all of (CSCI 121, CSCI 125)')
        r('any of (CSCI 121, CSCI 125)')
        r('exactly one course where { x = y }')
        r('at most one course where { x = y }')
        r('at most three courses from children')
        r('three courses where {department = HIST & level = 300}')
        r(
            `one of (
            HIST 101, 111, 115, 117, 121,
                 122, 126, 140, 151, 169,

                 188.A.2012.1,
                 188.B.2012.1,
                 188.*.2012.3,
                 188.*.2013.3,

                 188.*.2015.1,
                 188.*.2015.3,

                 190, 191,

                 210, 211, 212, 217, 218,
                 219, 220, 222, 224, 226,
                 227, 230, 231, 237, 239,
                 296,

                 299.B.2012.1,
                 299.B.2012.3,
                 299.*.2013.3,
                 299.A.2015.3,
                 299.B.2015.3,
        )`
        )
        r(
            `
            Basic & Transitions & Perspectives & Level III & Sequence & Electives &
            seven courses from (Transitions, Perspectives, Level III, Sequence, Electives) &
            at most two courses from children where { department != MATH }
		`
        )
        r('one course where { dept = (CSCI | ASIAN) & num >= 130 }')
        r(
            'one of (MATH 230, 242,  236, 262, 266, (STAT 212 & 214 & 272), STAT 316, MATH 330)'
        )
        r('one course besides MATH 390 from filter')
        r('two distinct courses where { gereqs = SPM }')
        r('two courses where { gereqs = HWC }')
        r('two courses from children & two departments from children')

        r('one course where {x = y}')
        r('one course where { x = (a & b) }')
        r('one course where { x = (a & b & c) }')
        r('one course where { x = (a | b | c) }')

        r('one course where { num = 130 }')
        r('one course where { num == 130 }')
        r('one course where { num != 130 }')
        r('one course where { num <= 130 }')
        r('one course where { num < 130 }')
        r('one course where { num > 130 }')
        r('one course where { num >= 130 }')

        r('zero occurrences of CSCI 121')
        r('one occurrences of CSCI 121')
        r('one-point-five occurrences of CSCI 121')
        r('two occurrences of CSCI 121')
        r('three occurrences of CSCI 121')
        r('four occurrences of CSCI 121')
        r('five occurrences of CSCI 121')
        r('six occurrences of CSCI 121')
        r('seven occurrences of CSCI 121')
        r('eight occurrences of CSCI 121')
        r('nine occurrences of CSCI 121')
        r('ten occurrences of CSCI 121')

        r('three courses from children where { level = 300 }')
        r('three credits from courses where { level = 300 }')
        r('three departments from children')
        r(
            'three courses from ( ChildRequirementNameHere, OrMaybeOtherChild ) where { level = 300 }'
        )

        t(
            'three departments from courses where { x = y }',
            'cannot use a modifier with "departments"'
        )
        t(
            'one department from (Child) where { x = y }',
            'must use "courses from" with "children where"'
        )
        t(
            'at most one credit from filter',
            'can only use at-least style counters with non-course requests'
        )
        t(
            'at most one department from filter',
            'can only use at-least style counters with non-course requests'
        )
        r('one department from Child')

        r('one of (AS/RE 121)')

        r(
            `
			one course where {
                gereqs = EIN &
                year >= min (year) from courses where {
                    gereqs = BTS-T
                }
            }
		`
        )

        r('Biblical Studies (BTS-B)')

        r('CSCI 121')
        r('CSCI 121.A')
        r('CSCI 121.Z')
        r('CSCI 121L.Z')
        r('CSCI 121I.Z')
        r('CSCI 121IL.Z')
        t('CSCI 121LI.Z')
        t(
            'CSCI 121.a',
            'A course section must be either an uppercase letter [A-Z] or an asterisk [*].'
        )
        r('CSCI 121.*')
        r('CSCI 121.*.2014')
        t(
            'CSCI 121.*.111',
            'A course year must be either a four-digit year [e.g. 1994] or an asterisk [*].'
        )
        r('CSCI 121.*.*')
        r('CSCI 121.*.*.1')
        r('CSCI 121.*.*.5')
        t(
            'CSCI 121.*.*.0',
            'A course semester must be either a number between 1 [Fall] and 5 [Summer Session 2], or an asterisk [*].'
        )
        t(
            'CSCI 121.*.*.6',
            'A course semester must be either a number between 1 [Fall] and 5 [Summer Session 2], or an asterisk [*].'
        )

        t(
            'seven of (CSCI 121, CSCI 211)',
            'you requested 7 items, but only gave 2 options'
        )
    })
})
