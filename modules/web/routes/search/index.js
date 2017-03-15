export default {
    path: 'search',
    getComponents(state, cb) {
        require.ensure([], () => {
            cb(null, {
                overlay: require('./course-searcher-overlay').default,
            })
        }, 'course-overlay.components')
    },
}
