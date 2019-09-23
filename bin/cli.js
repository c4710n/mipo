#!/usr/bin/env node
'use strict'

const mipi = require('..') /* eslint-disable-line node/no-unpublished-require */
const { name } = require('../package.json')
const path = require('path')
const yargs = require('yargs')

const { argv } = yargs
  .scriptName(name)
  .usage('$0 <input> <output> [options]')
  .option('l', {
    alias: 'logo',
    demandOption: false,
    describe: 'specify logo file',
    type: 'string',
  })
  .option('m', {
    alias: 'media',
    demandOption: false,
    describe: 'specify directory for placing medias',
    type: 'string',
  })
  .help()

const {
  _: [input, output],
  logo,
  media,
} = argv

if (!input) {
  console.error('input must be provided.\n')
  yargs.showHelp()
  return
}

if (!output) {
  console.error('output must be provied.\n')
  yargs.showHelp()
  return
}

const cwd = process.cwd()
const inputFile = path.join(cwd, input)
const outputFile = path.join(cwd, output)

const options = {}
if (logo) {
  const logoFile = path.join(cwd, logo)
  options.logoFile = logoFile
}

if (media) {
  const mediaPath = path.join(cwd, mediaPath)
  options.mediaPath = mediaPath
}

mipi(inputFile, outputFile, options)
