export default {
  path: 's/:studentId',

  getIndexRoute(location, cb) {
    require.ensure([], () => {
      cb(null, require('./routes/course-table').default)
    }, 'student.index')
  },

  getChildRoutes(state, cb) {
    cb(null, [
      require('./routes/share').default, // share, overlay
      require('./routes/search').default, // search, sidebar
      require('./routes/semester-detail').default, // :year/:term, content
    ])
  },

  getComponents(location, cb) {
    require.ensure([], () => {
      cb(null, { content: require('./containers/student').default })
    }, 'student.components')
  },
}
