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
const { getScreenshot } = require('../utils/image')
const {
  getMarkdownSection,
  getHighlights,
  getLeftoverSections,
  getInstallationSteps,
  getLeftoverReadme,
  getTagline
} = require('../utils/markdown')

/**
 * TODO: convert this to normal markdown
 *
 * @summary Get sites using the project from Readme
 * @function
 * @private
 *
 * @param {String} readme - Readme file
 * @returns {Object}
 *
 * @example
 * getExamples(readme)
 */
const getExamples = async(readme) => {
  const content = await getMarkdownSection(readme, 'Examples')
  if (!content) {
    return ''
  }
  const tree = _.tail(markdown.parse(content))

  // eslint-disable-next-line lodash/matches-prop-shorthand
  const listIndex = _.findIndex(tree, (node) => {
    return node[0] === 'bulletlist'
  })

  if (listIndex === -1) {
    return null
  }

  const examples = await Bluebird.map(
    _.tail(tree[listIndex]),
    async(highlight) => {
      const websiteUrl = highlight.slice(1)[0][1].href

      return {
        name: _.last(highlight.slice(1)[0]),
        website: websiteUrl,
        description: highlight.slice(1)[1].replace(' - ', ''),
        screenshot: await getScreenshot(websiteUrl)
      }
    }
  )

  return examples
}

module.exports = async(backend) => {
  const { readme } = await Bluebird.props({
    readme: backend.readFile('README.md')
  })

  if (!readme) {
    return {
      highlights: null,
      installationSteps: null,
      examples: null,
      motivation: null,
      hardwareRequired: null,
      softwareRequired: null,
      readmeLeftover: null,
      introduction: null,
      setup: null,
      help: null,
      contributing: null,
      license: null
    }
  }

  return {
    tagline: await getTagline(readme),
    highlights: await getHighlights(readme),
    installationSteps: await getInstallationSteps(readme),
    examples: await getExamples(readme),
    motivation: await getMarkdownSection(readme, 'Motivation'),
    hardwareRequired: await getMarkdownSection(readme, 'Hardware required'),
    softwareRequired: await getMarkdownSection(readme, 'Software required'),
    introduction: await getMarkdownSection(readme, 'Introduction'),
    setup: await getMarkdownSection(readme, 'Setup and configuration'),
    leftoverSections: await getLeftoverSections(
      readme,
      [
        'Introduction',
        'Motivation',
        'Highlights',
        'Examples',
        'Installation',
        'Hardware required',
        'Software required',
        'Setup and configuration'
      ],
      true
    ),
    readmeLeftover: await getLeftoverReadme(readme)
  }
}
