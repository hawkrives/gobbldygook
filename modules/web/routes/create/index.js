export default {
    path: 'create',

    indexRoute: {
        component: require('./welcome').default,
    },

    getChildRoutes(location, cb) {
        cb(null, [
            {
                path: 'sis',
                getComponent(location, cb) {
                    require.ensure([], () => {
                        cb(null, require('./method-import').default)
                    }, 'new-student.import.component')
                },
            },
            {
                path: 'manual',
                getComponent(location, cb) {
                    require.ensure([], () => {
                        cb(null, require('./method-manual').default)
                    }, 'new-student.manual.component')
                },
            },
            {
                path: 'drive',
                getComponent(location, cb) {
                    require.ensure([], () => {
                        cb(null, require('./method-drive').default)
                    }, 'new-student.drive.component')
                },
            },
            {
                path: 'upload',
                getComponent(location, cb) {
                    require.ensure([], () => {
                        cb(null, require('./method-upload').default)
                    }, 'new-student.upload.component')
                },
            },
        ])
    },

    getComponents(location, cb) {
        cb(null, {
            content: require('./new-student').default,
        })
    },
}
