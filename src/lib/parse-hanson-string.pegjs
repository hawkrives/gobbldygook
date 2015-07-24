{
  var globalLastDept

  function storeDept(dept) {
    globalLastDept = dept
  }

  function fetchDept(dept) {
    return globalLastDept
  }

  var flatten = require('lodash').flatten
  var assign = require('lodash').assign
  var expandDepartment = require('./expand-department')
}

start
  = or

expr 'expression'
  = _ e:(
      not
    / parenthetical
    / course
    / where
    / filter
    / occurrence
    / of
    / modifier
    / reference
  ) _
  { return e }


// Primitives

optional_s
  = 's'?

where
  = count:counter _ 'course' optional_s _ 'where' _ where:qualifier
  { return {
      $type: 'where',
      $count: count,
      $where: where,
  } }

filter
  = 'only' _ 'courses' _ filter:(
      'where' _ where:qualifier { return {$where: where} }
    / 'from' _ of:of_list { return {$of: of} }
  )
  { return assign({
      $type: 'filter',
  }, filter ) }

occurrence
  = count:counter _ 'occurrence' optional_s _ 'of' _ course:course
    { return {
        $type: 'occurrence',
        $count: count,
        $course: course.$course,
    } }

// Primitive Components

qualifier
  = '{' _ q:or_q _ '}'
    { return q }

or_q 'qualification-or'
  = lhs:and_q _ '|' _ rhs:or_q
    { return {
      $type: 'boolean',
      $or: [lhs].concat('$or' in rhs ? rhs.$or : [rhs]),
    } }
  / and_q


and_q 'qualification-and'
  = lhs:parenthetical_q _ '&' _ rhs:and_q
    { return {
      $type: 'boolean',
      $and: [lhs].concat('$and' in rhs ? rhs.$and : [rhs]),
    } }
  / parenthetical_q


parenthetical_q
  = open_paren _ q:or_q _ close_paren
    { return q }
  / qualification


qualification
  = key:word _
    op:operator _
    value:(
        f:func _ 'from' _ 'courses' _ 'where' _ q:qualifier
          { return assign(f, {$where: q}) }
      / word:[a-z0-9_\-]i+
          { return word.join('') }
    )
    { return {
        $type: 'qualification',
        $key: key,
        $operator: op,
        $value: value,
    } }


func 'function'
  = name:word _ open_paren _ prop:word _ close_paren
    { return {
      $name: name,
      $prop: prop,
      $type: 'function',
    } }

operator
  = ('<=')       { return '$lte' }
  / ('<')        { return '$lt'  }
  / ('==' / '=') { return '$eq'  }
  / ('>=')       { return '$gte' }
  / ('>')        { return '$gt'  }
  / ('!=')       { return '$ne'  }

_ 'whitespace'
  = [ \n\t\r]*

counter
  = english_integer
  / numeric_integer

english_integer
  = num:(
        'zero'
      / 'eleven' / 'one'
      / 'twelve' / 'two'
      / 'thirteen' / 'three'
      / 'fourteen' / 'four'
      / 'fifteen' / 'five'
      / 'sixteen' / 'six'
      / 'seventeen' / 'seven'
      / 'eighteen' / 'eight'
      / 'nineteen' / 'nine'
      / 'twenty' / 'ten'
    )
    {
      if (num === 'zero')  { return 0 }
      else if (num === 'one')   { return 1 }
      else if (num === 'two')   { return 2 }
      else if (num === 'three') { return 3 }
      else if (num === 'four')  { return 4 }
      else if (num === 'five')  { return 5 }
      else if (num === 'six')   { return 6 }
      else if (num === 'seven') { return 7 }
      else if (num === 'eight') { return 8 }
      else if (num === 'nine')  { return 9 }
      else if (num === 'ten')   { return 10 }
      else if (num === 'eleven')    { return 11 }
      else if (num === 'twelve')    { return 12 }
      else if (num === 'thirteen')  { return 13 }
      else if (num === 'fourteen')  { return 14 }
      else if (num === 'fifteen')   { return 15 }
      else if (num === 'sixteen')   { return 16 }
      else if (num === 'seventeen') { return 17 }
      else if (num === 'eighteen')  { return 18 }
      else if (num === 'nineteen')  { return 19 }
      else if (num === 'twenty')    { return 20 }
    }


// Expressions

not
  = '!' _ value:expr
    { return {
      $type: 'boolean',
      $not: value
    } }

parenthetical
  = open_paren _ value:start _ close_paren
    { return value }

or
  = lhs:and _ '|' _ rhs:or
    { return {
      $type: 'boolean',
      $or: [lhs].concat('$or' in rhs ? rhs.$or : [rhs]),
    } }
  / and

and
  = lhs:expr _ '&' _ rhs:and
    { return {
      $type: 'boolean',
      $and: [lhs].concat('$and' in rhs ? rhs.$and : [rhs]),
    } }
  / expr

of_list
  = open_paren _
    of:(
      val:start
      rest:( _ ',' _ second:start { return second } )*
      { return [val].concat(rest) }
    )+ _ ','? _
    close_paren
    { return flatten(of) }

of
  = count:(
        counter
      / 'all'
      / 'any' { return 1 }
      / 'none' { return 0 }
    )
    _ 'of' _ of:of_list
    {
      if (count === 'all')
        count = of.length

      if (count && of.length < count)
        throw new Error(`you requested ${count} items, but only listed ${of.length} options (${JSON.stringify(of)}).`)

      return {
        $type: 'of',
        $count: count,
        $of: of,
      }
    }

modifier
  = count:counter _
    what:(
        'course'
      / 'credit'
      / 'department'
    ) optional_s _ 'from' _
    from:(
        'children' { return { $from: 'children', $children: '$all' }}
      / 'filter' { return { $from: 'filter' }}
      / 'courses' _ 'where' _ where:qualifier { return {$from: 'where', $where: where} }
      / // select a few requirements to apply the modifier to
        // an alternative to "from children"
        open_paren _ reqs:(
          val:reference
          rest:( _ ',' _ second:reference { return second } )*
          { return [val].concat(rest) }
        )+ _ ','? _ close_paren
        { return { $from: 'children', $children: flatten(reqs) } }
    )
    {
      if (what === 'department' && from['$from'] === 'where')
        throw new Error('cannot use a modifier with "departments from courses"')
      return assign({
        $type: 'modifier',
        $count: count,
        $what: what,
      }, from)
    }


requirement_title
  = title:(
      initial:[A-Z0-9]
      rest:[A-Za-z0-9_\- /]*
      { return initial + rest.join('') }
    )
    { return title.trim() }


reference 'requirement reference'
  = title:(
      a:requirement_title
      b:(_ '(' t:requirement_title ')' { return ` (${t})` })?
      { return `${a}${b || ''}` }
    )
    {
      if (options.abbreviations && title in options.abbreviations) {
        title = options.abbreviations[title]
      }
      else if (options.titles && title in options.titles) {
        title = options.titles[title]
      }
      return {
        $type: 'reference',
        $requirement: title,
      }
    }


// Course

dot 'a single period'
  = '.'

course
  = dept:c_dept? _
    num:c_num
    details:(
      dot section:c_sect sub:(
        dot year:c_year sub:(
          dot semester:c_sem { return {semester} }
        )? { return assign({year}, sub) }
      )? { return assign({section}, sub) }
    )?
  {
    return {
      $type: 'course',
      $course: assign(details || {},
                      dept || fetchDept() || {},
                      num)
    }
  }

c_dept
  = dept1:(c1:uppercase_letter c2:uppercase_letter { return c1 + c2 })
    part2:(
        chars:uppercase_letter+
          { return {dept: chars.join(''), type: 'joined'} }
      / '/' l1:uppercase_letter l2:uppercase_letter
          { return {dept: l1 + l2, type: 'seperate'} }
    )
    {
      let {type, dept: dept2} = part2
      let department
      if (type === 'joined') {
        department = {department: [dept1 + dept2]}
      }
      else if (type === 'seperate') {
        department = {department: [
          expandDepartment(dept1),
          expandDepartment(dept2)
        ]}
      }
      storeDept(department)
      return department
    }

c_num 'course number'
  = num:(
        nums:(digit digit digit)
          { return {number: parseInt(nums.join(''))} }
      / num:digit 'XX'
          { return {level: num * 100} }
    )
    international:'I'? lab:'L'?
    {
      let result = {}

      if (international) {
        result.international = true
      }
      if (lab) {
        result.lab = true
      }

      return assign(result, num)
    }

c_sect
  = uppercase_letter
  / '*'

c_year
  = nums:(digit digit digit digit)
    { return parseInt(nums.join('')) }
  / '*'

c_sem
  = num:[1-5] { return parseInt(num) }
  / '*'


// Primitives

uppercase_letter
  = char:[A-Z]
    { return char }

word
  = chars:[a-z]i+
    { return chars.join('') }

numeric_integer
  = num:digit+
    { return parseInt(num.join('')) }

digit
  = num:[0-9]
    { return parseInt(num) }

open_paren
  = '('

close_paren
  = ')'
