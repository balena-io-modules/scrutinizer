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

const _ = require('lodash')

const MARKDOWN_IMAGE_REGEX = /(?:!\[(.*?)\]\((.*?)\))/g
const RAW_PATH = '/blob/master'

/**
 * @summary Replace all relative image paths with absolute Github URLs
 * @function
 * @public
 *
 * @param {String} markdown - markdown text
 * @param {String} prefix - Github repo path
 * @returns {String}
 *
 * @example
 * formatRelativeImagePaths('block of text', prefix)
 */
const formatRelativeImagePaths = (markdown, prefix) => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter
  return markdown.replace(MARKDOWN_IMAGE_REGEX, (_match, label, path) => {
    // Ignore image paths with protocol
    if (path.includes('://')) {
      return path
    }

    // Strip optional dot
    const normalizedPath = _.trimStart(path, '.')

    // Restructure the image path
    return `![${label}](${prefix}${RAW_PATH}${normalizedPath})`
  })
}

module.exports = (backend) => {
  return backend.readFile('README.md').then(({
    file, prefix
  }) => {
    if (!file) {
      return {
        readme: null
      }
    }

    const formattedReadme = formatRelativeImagePaths(file, prefix)

    return {
      readme: formattedReadme
    }
  })
}
