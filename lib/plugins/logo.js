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
const { markdown } = require('markdown')
const unified = require('unified')

const remarkParse = require('remark-parse')
const remark2rehype = require('remark-rehype')

const raw = require('rehype-raw')

const rehype2remark = require('rehype-remark')
const stringify = require('remark-stringify')

const { convertRemoteImageToBase64 } = require('../utils/image')
const mmm = require('mmmagic')
const Magic = mmm.Magic
const magic = Bluebird.promisifyAll(new Magic(mmm.MAGIC_MIME_TYPE))

const Tesseract = require('tesseract.js')
const sharp = require('sharp')

const absoluteUrlRe = new RegExp('^(?:[a-z]+:)?//', 'i')

/**
 * @summary Detects is the url is absolute or not
 * @function
 * @private
 *
 * @param {String} url - the URL
 * @returns {Boolean}
 *
 * @example
 * console.log(isAbsoluteUrl("https://google.com")) // true
 *
 * @example
 * console.log(isAbsoluteUrl("./some-image.png")) // false
 */
const isAbsoluteUrl = (url) => {
  return absoluteUrlRe.test(url)
}

/**
 * @summary Detects Text from Image using Tesseract OCR
 * @function
 * @private
 *
 * @param {String} imageUrl - image url
 * @returns {Promise}
 *
 * @example
 * detectTextFromImage("https://unsplash.com/nature/example.png").then((imageText) => {
 *    console.log(imageText)
 * })
 */
const detectTextFromImage = (imageUrl) => {
  return Tesseract.recognize(imageUrl, 'eng').then(({ data: { text } }) => {
    // Discard any results under 3 characters as it is probably noise
    return text && text.length >= 3 ? text : null
  })
}

/**
 * @summary extracts mimeType and data from base64 encoded strings
 * @function
 * @private
 *
 * @param {String} encoded - base64 encoded string
 * @returns {{mimeType: String, data: String}}
 *
 * @example
 * const {mimeType, data} = base64MimeType(string)
 */
const base64MimeType = (encoded) => {
  if (!_.isString(encoded)) {
    return { mimeType: null, data: encoded }
  }

  const [ , mimeType, data ] = encoded.match(
    /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,(.*)/
  )

  return { mimeType, data }
}
/* eslint-enable */

/**
 * @summary Get logo Text and base64 image.
 * @function
 * @private
 *
 * @param {String} imageUrl - image link, either relative or absolute.
 * @param {Object} backend -
 * @returns {Promise}
 *
 * @example
 * getLogoFromUrl("https://unsplash.com/nature/tree.jpg").then(({logo}) => {
 *    console.log(logo);
 * })
 */
const getLogoFromUrl = async(imageUrl, backend) => {
  let logoText = null
  let base64Image = null

  if (isAbsoluteUrl(imageUrl)) {
    base64Image = await convertRemoteImageToBase64(imageUrl)
    const { mimeType, data } = base64MimeType(base64Image)
    let buffer = Buffer.from(data, 'base64')
    if (mimeType === 'image/svg') {
      buffer = await sharp(buffer).png().toBuffer()
      base64Image = `data:image/png;base64,${buffer.toString('base64')}`
    }
    logoText = await detectTextFromImage(buffer)
  } else {
    let localImageUrl = imageUrl
    if (imageUrl.startsWith('./')) localImageUrl = imageUrl.replace('./', '')

    // The image is local to the repo so we can fetch it via the backend
    const files = await Bluebird.props({
      logo: backend.readFile(localImageUrl)
    })
    let buffer = Buffer.from(files.logo, 'base64')
    const mimeType = await magic.detectAsync(buffer)
    base64Image = `data:${mimeType};base64,${files.logo}`
    if (mimeType === 'image/svg') {
      buffer = await sharp(buffer).png().toBuffer()
      base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`
    }
    logoText = await detectTextFromImage(buffer)
  }

  return {
    logo: {
      base64: base64Image,
      textContent: logoText
    }
  }
}

module.exports = (backend) => {
  return Bluebird.props({
    readme: backend.readFile('README.md')
  }).then((files) => {
    return (
      unified()

        // Parse markdown using github format
        .use(remarkParse, { gfm: true })

        // Convert to rehype (HTML processor) ast.
        .use(remark2rehype, { allowDangerousHtml: true })

        // Raw reads html inside md.
        .use(raw)

        // Convert html back to markdown ast
        .use(rehype2remark)

        // Convert ast to md string
        .use(stringify)
        .process(files.readme)
        .then((file) => {
          // TODO: We are converting again here. Ideally we should we dealing it with a
          // unified plugin. Refactor when possible
          const tree = markdown.parse(file.contents)

          if (!_.isEmpty(tree)) {
            // Get the first element
            let markdownElement = tree[1]

            if (_.has(markdownElement, [ 'references' ])) {
              markdownElement = tree[2]
            }

            // The image might be under a path like: p -> a -> img
            while (
              _.isArray(markdownElement) &&
              !_.isEmpty(markdownElement) &&
              _.head(markdownElement) !== 'img'
            ) {
              /* The structure of the element will be an array with
                 1. Element type as string (e.g. 'header')
                 2. Any properties (e.g. level: 2)
                 3. The next nested child element.

                 We'll be parsing through all the child elements,
                 until there is an image or no more elements to parse
                 */
              markdownElement = _.last(markdownElement)
            }

            // If the last element is an image, get the href attribute which will be
            // inside an object, in the second item of the array (see above)
            // TODO: Handle the case when logo is an svg.
            const imageUrl = _.get(markdownElement, [ [ 1 ], 'href' ], null)

            if (imageUrl) {
              return getLogoFromUrl(imageUrl, backend)
            }

            return {
              logo: null
            }
          }

          return {
            logo: null
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            logo: null
          }
        })
    )
  })
}
