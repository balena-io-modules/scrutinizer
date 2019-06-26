/*
 * Copyright 2019 balena
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

const Bluebird = require('bluebird')
const _ = require('lodash')
const {
  markdown
} = require('markdown')

module.exports = (backend) => {
  return Bluebird.props({
    readme: backend.readFile('README.md')
  }).then((files) => {
    const tree = markdown.parse(files.readme)

    if (!_.isEmpty(tree)) {
      // Get the first element
      let markdownElement = tree[1]

      // The image might be under a path like: p -> a -> img
      while (
        _.isArray(markdownElement) &&
        !_.isEmpty(markdownElement) &&
        _.head(markdownElement) !== 'img'
      ) {
        markdownElement = _.last(markdownElement)
      }

      return {
        logo: _.get(markdownElement, [ [ 1 ], 'href' ], null)
      }
    }

    return {
      logo: null
    }
  })
}
