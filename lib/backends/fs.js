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
const git = require('simple-git/promise')
const path = require('path')
const GitHubBackend = require('./github')
const packageJSON = require('../../package.json')
const debug = require('debug')(`${packageJSON.name}:backends:fs`)

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
   * @summary Restore the git repository to a clean state
   * @function
   * @public
   *
   * @returns {Promise}
   *
   * @example
   * const backend = new FileSystemBackend(...)
   * backend.restore().then(() => {
   *   console.log('The repository is ready to be used')
   * })
   */
  restore () {
    debug(`Hard-resetting repository to ${this.reference}`)
    return Bluebird.each([
      [ 'reset', 'HEAD', '.' ],
      [ 'checkout', '--', '.' ],
      [ 'reset', '--hard', this.reference ]
    ], (command) => {
      return git(this.repository).raw(command)

    // Setup a GitHub backend just in case we need it
    // for certain actions that really require their API
    }).then(() => {
      return this.getRepositoryUrl()
    }).then((url) => {
      if (!url) {
        return Bluebird.resolve()
      }

      this.github = new GitHubBackend(url, this.reference)
      return this.github.restore()
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
    return fs.readFileAsync(path.join(this.repository, file), {
      encoding: 'utf8'
    }).catch({
      code: 'ENOENT'
    }, _.constant(null))
  }

  /**
   * @summary Check if the repository is public
   * @function
   * @public
   *
   * @returns {Promise}
   *
   * @example
   * const backend = new FileSystemBackend(...)
   * backend.isPublic().then((isPublic) => {
   *   console.log(isPublic)
   * })
   */
  isPublic () {
    if (!this.github) {
      return null
    }

    return this.github.isPublic()
  }

  /**
   * @summary Get the list of all integrations
   * @function
   * @public
   *
   * @returns {Promise}
   *
   * @example
   * const backend = new FileSystemBackend(...)
   * backend.getIntegrations().then((integrations) => {
   *   console.log(integrations)
   * })
   */
  getIntegrations () {
    if (!this.github) {
      return null
    }

    return this.github.getIntegrations()
  }
}
