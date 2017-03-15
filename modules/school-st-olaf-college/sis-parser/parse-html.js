// @flow
'use strict'
const htmlparser = require('htmlparser2')

function parseHtml(string: string) {
    return htmlparser.parseDOM(string, {
        withDomLvl1: true,
        normalizeWhitespace: false,
        xmlMode: false,
        decodeEntities: true,
    })
}

module.exports.parseHtml = parseHtml
