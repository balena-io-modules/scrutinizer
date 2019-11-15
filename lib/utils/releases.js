'use strict'

const _ = require('lodash')

/**
 *
 * @param {String} str - The string to scrutinize
 * @returns {String}
 * @example
 * getOS(balenaEtcher-Portable-1.5.63.exe)
 */
const getOS = str => {
  if (
    _.includes(str, 'darwin') ||
    _.includes(str, '.dmg') ||
    _.includes(str, 'mac')
  ) {
    return 'macOS'
  } else if (
    _.includes(str, 'win32') ||
    _.includes(str, 'windows') ||
    _.includes(str, '.exe')
  ) {
    return 'Windows'
  } else if (
    _.includes(str, 'linux') ||
    _.includes(str, '.AppImage') ||
    _.includes(str, '.deb') ||
    _.includes(str, '.rpm')
  ) {
    return 'Linux'
  }

  return 'Unknown'
}

/**
 *
 * @param {String} str - The string to scrutinize
 * @returns {String}
 * @example
 * getArch(balenaEtcher-Portable-1.5.63.exe)
 */
const getArch = str => {
  if (
    _.includes(str, 'x64') ||
    _.includes(str, 'x86_64') ||
    _.includes(str, 'amd64') ||
    getOS(str) === 'macOS'
  ) {
    return 'x64'
  }
  return 'x86'
}

/**
 *
 * @param {String} str - The string to scrutinize
 * @returns {String}
 * @example
 * getArchString(balenaEtcher-Portable-1.5.63.exe)
 */
const getArchString = str => {
  switch (getArch(str)) {
    case 'x86':
      return '(32-bit)'
    case 'x64':
      return '(64-bit)'
    default:
      return 'Unknown'
  }
}

/**
 *
 * @param {String} str - The string to scrutinize
 * @returns {String}
 * @example
 * getInstallerType(balenaEtcher-Portable-1.5.63.exe)
 */
const getInstallerType = str => {
  if (getOS(str) === 'macOS') {
    return null
  }

  if (getOS(str) === 'Linux') {
    return '(AppImage)'
  }

  if (_.includes(str, 'portable')) {
    return '(Portable)'
  }

  return '(Installer)'
}

module.exports = {
  getArch, getArchString, getInstallerType, getOS
}
