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
const markdown = require('markdown').markdown
const _ = require('lodash')

module.exports = (backend) => {
  return Bluebird.props({
    faq: backend.readFile('FAQ.md')
  }).then(({ faq }) => {
    if (_.isEmpty(faq)) {
      return { faq: null }
    }

    const tree = _.tail(markdown.parse(faq))
    const result = []

    tree.forEach((node, index) => {
      if (node[0] === 'header') {
        result.push({
          title: _.last(node),
          content: tree[index + 1]
        })
      }
    })

    return { faq: result }
  })
}
