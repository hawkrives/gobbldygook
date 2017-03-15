import { buildQueryFromString } from '../build-query-from-string'

describe('buildQueryFromString', () => {
    it('handles an empty string', () => {
        expect(buildQueryFromString('')).toMatchSnapshot()
    })

    it('handles no arguments as an empty string', () => {
        expect(buildQueryFromString()).toMatchSnapshot()
    })

    it('handles an invalid second arg', () => {
        expect(buildQueryFromString('', null)).toMatchSnapshot()
    })

    it('builds a query string with multiple keys into a query object', () => {
        let query = 'dept: Computer Science  dept: Asian Studies  name: Parallel  level: 300  year: $OR year:2013 year: 2014'

        expect(buildQueryFromString(query)).toMatchSnapshot()
    })

    it('builds a query string with variable-case keys into a query object', () => {
        let query = 'dept: ASIAN  Dept: Religion  title: "Japan*"  LEVEL: 200  year: 2014  semester: $OR  semester: 3  semester: 1'

        expect(buildQueryFromString(query)).toMatchSnapshot()
    })

    it('builds a query string even with somewhat unconventional input', () => {
        let query = 'department: American Conversations  name: Independence  year: 2014  time: Tuesdays after 12'

        expect(buildQueryFromString(query)).toMatchSnapshot()
    })

    it('builds a query string while deduplicating synonyms of keys', () => {
        let query = 'ges: $AND  geneds: history of western culture gened: HBS  semester: Spring  year: 2014'

        expect(buildQueryFromString(query)).toMatchSnapshot()
    })

    it('builds a query string even with no keys', () => {
        let query = 'History of Asia'

        expect(buildQueryFromString(query, { words: true })).toMatchSnapshot()
    })

    it('can also search for deptnums even with no keys', () => {
        let query = 'ASIAN 220'

        expect(buildQueryFromString(query)).toMatchSnapshot()
    })

    it('can also search for deptnums with sections even with no keys', () => {
        let query = 'AS/RE 220A'

        expect(buildQueryFromString(query)).toMatchSnapshot()
    })

    it('returns an empty object when given nothing but whitespace', () => {
        expect(buildQueryFromString(' ')).toMatchSnapshot()
        expect(buildQueryFromString('	')).toMatchSnapshot()
        expect(buildQueryFromString('\t')).toMatchSnapshot()
        expect(buildQueryFromString('        ')).toMatchSnapshot()
        expect(buildQueryFromString('')).toMatchSnapshot()
    })

    it('handles multiple colons in a querystring', () => {
        let query = 'CSCI:helloworld:test:foo'

        expect(buildQueryFromString(query)).toMatchSnapshot()
    })

    it('handles a single key and no value', () => {
        let query = 'ENGL 200:'

        expect(buildQueryFromString(query)).toMatchSnapshot()
    })

    it('handles a otherwise-valid string that ends with a colon', () => {
        let query = 'deptnum: ENGL 200:'

        expect(buildQueryFromString(query)).toMatchSnapshot()
    })

    it('handles a string that ends with a colon', () => {
        let query = 'deptnum: ENGL 200 valid:'

        expect(buildQueryFromString(query)).toMatchSnapshot()
    })

    it('sorts a five-year token string correctly', () => {
        let query = 'year: $OR year: 2010 year: 2011 year: 2012 year: 2013 year: 2014'

        expect(buildQueryFromString(query)).toMatchSnapshot()
    })

    it('infers $AND from a list of multiple things', () => {
        let query = 'year: 2010 year: 2011 year: 2012 year: 2013 year: 2014'

        expect(buildQueryFromString(query)).toMatchSnapshot()
    })

    it('maps multiple multi-word queries to the same words array', () => {
        let query = 'title: Japan description: Otaku'

        expect(buildQueryFromString(query, { words: true })).toMatchSnapshot()
    })

    it('makes professors properly title-cased', () => {
        expect(buildQueryFromString('prof: Katherine Tegtmeyer-pak')).toMatchSnapshot()
        expect(buildQueryFromString('prof: Katherine Tegtmeyer-pak', { profWords: true })).toMatchSnapshot()
        expect(buildQueryFromString('prof: olaf a. hall-holt')).toMatchSnapshot()
        expect(buildQueryFromString('prof: olaf a. hall-holt', { profWords: true })).toMatchSnapshot()
    })

    it('parses credits correctly', () => {
        let query = 'credits: $OR credits: 1.0 credits: 0.25 credits: .25 credits: 1'

        expect(buildQueryFromString(query)).toMatchSnapshot()
    })

    it('turns pf from a "true" string into a boolean', () => {
        let query = 'pf: true'

        expect(buildQueryFromString(query)).toMatchSnapshot()
    })
})
