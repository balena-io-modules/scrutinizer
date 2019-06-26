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

const _ = require('lodash')

const MARKDOWN_IMAGE_REGEX = /(?:!\[(.*?)\]\((.*?)\))/g

/**
 * @summary Replace all relative image paths with absolute Github URLs
 * @function
 * @public
 *
 * @param {String} markdown - markdown text
 * @param {String} pathPrefix - Github repo path
 * @returns {String}
 *
 * @example
 * formatRelativeImagePaths('block of text', pathPrefix)
 */
const formatRelativeImagePaths = (markdown = '', pathPrefix) => {
  if (!pathPrefix) {
    return markdown
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter
  return markdown.replace(MARKDOWN_IMAGE_REGEX, (match, label, path) => {
    // Ignore image paths with protocol
    if (path.includes('://')) {
      return match
    }

    // Strip optional dot & forward slash
    let normalizedPath = _.trimStart(path, '.')
    normalizedPath = _.trimStart(normalizedPath, '/')

    // Restructure the image path
    return `![${label}](${pathPrefix}/master/${normalizedPath})`
  })
}

module.exports = {
  formatRelativeImagePaths
}
