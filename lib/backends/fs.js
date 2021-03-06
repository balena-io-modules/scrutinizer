/*
 * Copyright 2018 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const _ = require('lodash')
const Bluebird = require('bluebird')
const fs = Bluebird.promisifyAll(require('fs'))
const util = require('util')
const readdir = util.promisify(fs.readdir)
const path = require('path')
const GitHubBackend = require('./github')
const {
  imageFileExtensions,
  convertLocalImageToBase64
} = require('../utils/image')
module.exports = class FileSystemBackend {
  /**
   * @summary The file-system based backend
   * @class
   * @public
   *
   * @param {String} repository - git repository path
   * @param {String} reference - git repository reference
   *
   * @example
   * const backend = new FileSystemBackend('foo/bar', 'master')
   */
  constructor (repository, reference) {
    this.repository = repository
    this.reference = reference
  }

  /**
   * @summary Initialize the git repository
   * @function
   * @public
   *
   * @returns {Promise}
   *
   * @example
   * const backend = new FileSystemBackend(...)
   * backend.init().then(() => {
   *   console.log('The repository is ready to be used')
   * })
   */
  init () {
    return this.getRepositoryUrl().then((url) => {
      if (!url) {
        return Bluebird.resolve()
      }

      this.github = new GitHubBackend(url, this.reference)
      return this.github.init()
    })
  }

  /**
   * @summary Get the repository URL
   * @function
   * @private
   *
   * @returns {Promise}
   *
   * @example
   * const backend = new FileSystemBackend(...)
   * backend.getRepositoryUrl().then((url) => {
   *   console.log(url)
   * })
   */
  getRepositoryUrl () {
    return this.readFile('package.json').then((content) => {
      if (!content) {
        return null
      }

      return _.get(JSON.parse(content), [ 'repository', 'url' ], null)
    })
  }

  /**
   * @summary Read the contents of a directort
   * @function
   * @public
   *
   * @param {String} directory - directory path
   * @returns {Promise}
   *
   * @example
   * const backend = new GitHubBackend(...)
   * backend.readDirectoryFilePaths('docs').then((contents) => {
   *   console.log(contents)
   * })
   */
  readDirectoryFilePaths (directory) {
    if (!this.github) {
      return readdir(path.join(this.repository, directory)).then((files) => {
        const prefixedFiles = _.map(files, (file) => {
          return `${directory}/${file}`
        })
        return prefixedFiles
      })
    }
    return this.github.readDirectoryFilePaths(directory)
  }

  /**
   * @summary Read the contents of a file
   * @function
   * @public
   *
   * @param {String} file - file path
   * @returns {Promise}
   *
   * @example
   * const backend = new FileSystemBackend(...)
   * backend.readFile('README.md').then((contents) => {
   *   console.log(contents)
   * })
   */
  readFile (file) {
    return fs
      .readFileAsync(path.join(this.repository, file), {
        encoding: 'utf8'
      })
      .then((fileContent) => {
        if (imageFileExtensions.includes(file.split('.').reverse()[0])) {
          return convertLocalImageToBase64(fileContent)
        }
        return fileContent
      })
      .catch({ code: 'ENOENT' }, _.constant(null))
  }

  /**
   * @summary Get the basic Github metadata
   * @function
   * @public
   *
   * @returns {Promise}
   *
   * @example
   * const backend = new FileSystemBackend(...)
   * backend.getMetadata().then((metadata) => {
   *   console.log(metadata)
   * })
   */
  getMetadata () {
    if (!this.github) {
      return Bluebird.resolve(null)
    }

    return this.github.getMetadata()
  }

  /**
   * @summary Get the date of the last commit
   * @function
   * @public
   *
   * @returns {Promise}
   *
   * @example
   * const backend = new GitHubBackend(...)
   * backend.getLastCommitDate().then((lastCommitDate) => {
   *   console.log(lastCommitDate)
   * })
   */
  getLastCommitDate () {
    if (!this.github) {
      return null
    }

    return this.github.getLastCommitDate()
  }

  /**
   * @summary Get the contriburors
   * @function
   * @public
   *
   * @returns {Promise}
   *
   * @example
   * const backend = new GitHubBackend(...)
   * backend.this().then((list) => {
   *   console.log(list)
   * })
   */
  getContributors () {
    if (!this.github) {
      return null
    }

    return this.github.getContributors()
  }

  /**
   * @summary Get the latest release
   * @function
   * @public
   *
   * @returns {Promise}
   *
   * @example
   * const backend = new GitHubBackend(...)
   * backend.getReleases().then((releases) => {
   *   console.log(releases)
   * })
   */
  getLatestRelease () {
    if (!this.github) {
      return null
    }

    return this.github.getLatestRelease()
  }

  /**
   * @summary Get the latest prerelease
   * @function
   * @public
   *
   * @returns {Promise}
   *
   * @example
   * const backend = new GitHubBackend(...)
   * backend.getReleases().then((releases) => {
   *   console.log(releases)
   * })
   */
  getLatestPreRelease () {
    if (!this.github) {
      return null
    }

    return this.github.getLatestPreRelease()
  }

  /**
   * @summary Get the # of the open issues, along with the 20 latest ones
   * @function
   * @public
   *
   * @returns {Promise}
   *
   * @example
   * const backend = new GitHubBackend(...)
   * backend.getOpenIssues().then((openIssues) => {
   *   console.log(openIssues)
   * })
   */
  getOpenIssues () {
    if (!this.github) {
      return null
    }

    return this.github.getOpenIssues()
  }
}
