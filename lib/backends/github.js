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

const GitHub = require('@octokit/rest')
const _ = require('lodash')
const moment = require('moment')
const Bluebird = require('bluebird')
const packageJSON = require('../../package.json')
const debug = require('debug')(`${packageJSON.name}:backends:github`)

/**
 * @summary Log GitHub rate-limiting information
 * @function
 * @private
 *
 * @param {Object} headers - HTTP headers
 *
 * @example
 * github.repos.getContent({ ... }).then((results) => {
 *   logGitHubRateLimitingInformation(results.meta)
 * })
 */
const logGitHubRateLimitingInformation = (headers) => {
  const resetDate = new Date(headers['x-ratelimit-reset'] * 1000)
  debug(`Rate limiting: ${headers['x-ratelimit-remaining']}/${headers['x-ratelimit-limit']},
         will reset ${moment(resetDate).fromNow()}`)
}

module.exports = class GitHubBackend {
  /**
   * @summary The GitHub based backend
   * @class
   * @public
   *
   * @param {String} repository - git repository url
   * @param {String} reference - git repository reference
   *
   * @example
   * const backend = new GitHubBackend('git@github.com:foo/bar.git', 'master')
   */
  constructor (repository, reference) {
    this.reference = reference
    this.github = new GitHub({
      headers: {
        'User-Agent': packageJSON.name
      }
    })

    if (process.env.GITHUB_TOKEN) {
      debug('Using $GITHUB_TOKEN as the authentication token')
      this.github.authenticate({
        type: 'token',
        token: process.env.GITHUB_TOKEN
      })
    }

    const parsedUrl = repository.match(/([\w-]+)\/([\w-]+)(\.\w+)?$/)
    this.owner = parsedUrl[1]
    this.repo = parsedUrl[2]
  }

  /**
   * @summary Restore the git repository to a clean state
   * @function
   * @public
   *
   * @returns {Promise}
   *
   * @example
   * const backend = new GitHubBackend(...)
   * backend.restore().then(() => {
   *   console.log('The repository is ready to be used')
   * })
   */
  restore () {
    return Bluebird.resolve(this)
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
   * const backend = new GitHubBackend(...)
   * backend.readFile('README.md').then((contents) => {
   *   console.log(contents)
   * })
   */
  readFile (file) {
    return this.github.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path: file,
      ref: this.reference
    }).then((results) => {
      logGitHubRateLimitingInformation(results.meta)
      if (results.data.type === 'file') {
        const buffer = Buffer.from(results.data.content, results.data.encoding)
        return buffer.toString()
      }

      throw new Error(`Can't handle response: ${results.data}`)
    }).catch((error) => {
      logGitHubRateLimitingInformation(error.headers)
      if (error.code === 404) {
        return null
      }

      throw error
    })
  }

  /**
   * @summary Check if the repository is public
   * @function
   * @public
   *
   * @returns {Promise}
   *
   * @example
   * const backend = new GitHubBackend(...)
   * backend.isPublic().then((isPublic) => {
   *   console.log(isPublic)
   * })
   */
  isPublic () {
    return this.github.repos.get({
      owner: this.owner,
      repo: this.repo
    }).then((results) => {
      logGitHubRateLimitingInformation(results.meta)
      return !results.data.private
    })
  }

  /**
   * @summary Get the list of all integrations
   * @function
   * @public
   *
   * @returns {Promise}
   *
   * @example
   * const backend = new GitHubBackend(...)
   * backend.getIntegrations().then((integrations) => {
   *   console.log(integrations)
   * })
   */
  getIntegrations () {
    return this.github.repos.getProtectedBranchRequiredStatusChecks({
      owner: this.owner,
      repo: this.repo,
      branch: 'master'
    }).then((results) => {
      logGitHubRateLimitingInformation(results.meta)
      return _.uniq(_.map(results.data.contexts, (integration) => {
        if (_.startsWith(integration, 'continuous-integration')) {
          return _.split(integration, '/')[1]
        }

        return integration
      }))
    })
  }
}
