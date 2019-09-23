'use strict'

const { name } = require('../package.json')
const path = require('path')
const { spawn } = require('child_process')
const fs = require('fs-extra')
const localtime = require('localtime')

const TEMPLATE_DIR = path.join(__dirname, '../template')
const BUILD_BASE_DIR = path.join('/tmp', `${name}-build`)

function convert(inputFile, outputFile, { logoFile, _mediaPath } = {}) {
  cloneDir(TEMPLATE_DIR, BUILD_BASE_DIR)
  copyContent(inputFile, BUILD_BASE_DIR)

  const locals = generateLocals({
    logo: logoFile,
    updated_at: localtime('', 'YYYY-MM-DD hh:mm'),
  })

  spawn(
    'npx',
    ['relaxed', 'index.pug', outputFile, '--build-once', '--locals', locals],
    {
      cwd: BUILD_BASE_DIR,
      detached: true,
      stdio: 'inherit',
    }
  )
}

module.exports = convert

function cloneDir(srcPath, destPath) {
  fs.ensureDirSync(destPath)
  fs.copySync(srcPath, destPath)
}

function copyContent(filePath, dirPath) {
  const srcFile = filePath
  const destFile = path.join(dirPath, 'content.md')

  fs.copySync(srcFile, destFile)
}

function generateLocals({ logo, updated_at } = {}) {
  const raw = {}

  if (logo) {
    raw.logo = logo
  }

  if (updated_at) {
    raw.updated_at = updated_at
  }

  return JSON.stringify(raw)
}
