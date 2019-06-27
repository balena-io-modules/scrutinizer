/*
 * Copyright 2019 Balena
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

const NpmApi = require('npm-api')
const _ = require('lodash')

module.exports = (backend) => {
  return backend.readFile('package.json').then((packageJSON) => {
    if (packageJSON) {
      const {
        name: repoName,
        author: repoAuthor,
        private: isPrivate
      } = JSON.parse(packageJSON)

      if (isPrivate) {
        return {
          npmPackage: false
        }
      }

      const npm = new NpmApi()
      const repo = npm.repo(repoName)

      // Guarding against false positives by checking against the author prop
      return repo.prop('author').then(
        (author) => {
          /*
            The package.json stores the author info as a string
            - Resin Inc. <hello@resin.io>

            But the repo responds with an object
            - { name: 'Resin Inc.', email: 'hello@resin.io' }
          */
          const authorAsString = `${author.name} <${author.email}>`

          return {
            npmPackage: _.isEqual(authorAsString, repoAuthor)
          }
        },
        (error) => {
          console.log(error)
          return {
            npmPackage: false
          }
        }
      )
    }

    return {
      npmPackage: false
    }
  })
}
