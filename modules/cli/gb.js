#!/usr/bin/env node
'use strict'
const nomnom = require('nomnom')
const yaml = require('js-yaml')

const update = require('./gb-update')
const search = require('./gb-search')
const check = require('./gb-check')
const lint = require('./gb-lint')

module.exports.cli = function cli() {
    process.on('unhandledRejection', (reason, p) => {
        console.error('Unhandled rejection in', p)
        console.error('Reason:', reason)
    })

    const nom = nomnom()

    nom.command('check')
		.callback(check)
		.help('check a student')

    nom.command('lint')
		.callback(lint)
		.help('lint (syntax-check) an area file')

    nom.command('update')
		.callback(update)
		.help('update local data cache')

    nom.command('search')
		.callback(search)
		.help('search for a course')
		.option('riddles', {
    type: 'string',
    required: true,
    list: true,
    position: 1,
    transform: yaml.safeLoad,
    help: 'A YAML-encoded filtering object. Passed to lodash.filter',
})
		.option('list', {
    flag: true,
    default: true,
    help: 'Print matching courses in a list',
})
		.option('unique', {
    flag: false,
    metavar: 'KEY',
    type: 'string',
    transform: yaml.safeLoad,
    help: 'Run a uniqing filter over the list of found courses, based on the given key',
})
		.option('sort', {
    type: 'string',
    list: true,
    flag: false,
    metavar: 'KEY',
    default: 'year',
    transform: yaml.safeLoad,
    help: 'A key/array of keys to sort the courses by',
})

    nom.option('debug', {
        string: '-d, --debug',
        flag: true,
        help: 'print debugging information',
    })

    const args = nom.parse()

    if (args.debug) {
        console.log(args)
    }
}
