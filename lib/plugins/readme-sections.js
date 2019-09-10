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
const markdown = require('markdown').markdown

/**
 * @summary Get motivation from Readme
 * @function
 * @private
 *
 * @param {String} readme - Readme file
 * @returns {Object}
 *
 * @example
 * getMotivation(readme)
  */
const getMotivation = (readme) => {
  const tree = _.tail(markdown.parse(readme))
  const startIndex = _.findIndex(tree, (node) => {
    return _.first(node) === 'header' && _.last(node) === 'Motivation'
  })

  if (startIndex === -1) {
    return null
  }

  return tree[startIndex + 1]
}

/**
 * @summary Get installation steps from Readme
 * @function
 * @private
 *
 * @param {String} readme - Readme file
 * @returns {Object}
 *
 * @example
 * getInstallationSteps(readme)
  */
const getInstallationSteps = (readme) => {
  const tree = _.tail(markdown.parse(readme))
  const startIndex = _.findIndex(tree, (node) => {
    return _.first(node) === 'header' && _.last(node) === 'Installation'
  })

  if (startIndex === -1) {
    return null
  }

  const header = tree[startIndex]
  const rest = tree.slice(startIndex + 1)
  const endIndex = _.findIndex(rest, (node) => {
    return _.first(node) === 'header' && node[1].level === header[1].level
  })

  const content = rest.slice(0, endIndex)
  // eslint-disable-next-line lodash/matches-prop-shorthand
  const listIndex = _.findIndex(content, (node) => {
    return node[0] === 'numberlist'
  })

  if (listIndex === -1) {
    return null
  }

  return {
    headers: [],
    steps: _.map(_.tail(content[listIndex]), (node) => {
      return _.tail(node)
    }),
    footer: content.slice(listIndex + 1)
  }
}

module.exports = (backend) => {
  return Bluebird.props({
    readme: backend.readFile('README.md')
  }).then(({
    readme
  }) => {
    if (!readme) {
      return {
        installationSteps: null,
        motivation: null
      }
    }
    return {
      installationSteps: getInstallationSteps(readme),
      motivation: getMotivation(readme)
    }
  })
}
