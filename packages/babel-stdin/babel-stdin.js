#!/usr/bin/env node
/* eslint-disable strict */
'use strict'

const getStdin = require('get-stdin')
const babel = require('babel-core')

getStdin()
	.then(code => {
		const result = babel.transform(code, {
			compact: true,
			extends: './.babelrc',
			highlightCode: false,
		})
		console.log(result.code)
	})
	.catch(err => {
		console.error(err)
		console.error(err.codeFrame)
	})
