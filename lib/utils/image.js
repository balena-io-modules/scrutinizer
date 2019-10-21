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

const http = require('http')
const puppeteer = require('puppeteer')
const tmp = require('tmp')
const fs = require('fs')
const https = require('https')
const {
  URL
} = require('url')
const Promise = require('bluebird')

/**
 * @summary Get the base64 representation of a image blob
 * @function
 * @public
 *
 * @param {String} imagePath - the URL of the image
 * @returns {Promise}
 *
 * @example
 * convertRemoteImageToBase64('https://picsum.photos/id/270/200/300')
 *  .then((imageAsBase64) => {
 *    console.log(imageAsBase64)
 * })
 */
const convertRemoteImageToBase64 = (imagePath = '') => {
  const url = new URL(imagePath)

  // https://nodejs.org/api/https.html#https_https
  const client = url.protocol === 'https:' ? https : http

  return new Promise((resolve, reject) => {
    return client
      .get(imagePath, (res) => {
        res.setEncoding('base64')

        // Prepare the prefix, e.g. data:image/jpeg;base64,
        let body = `data:${res.headers['content-type']};base64,`

        // Build the body
        res.on('data', (data) => {
          body += data
        })

        res.on('end', () => {
          resolve(body)
        })
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

/**
 * @summary Take a screenshot of a URL page
 * @function
 * @public
 *
 * @param {String} website - the URL of the website to take screenshot of
 * @returns {Promise}
 *
 * @example
 * getScreenshot('https://wwwbalena.io')
 *  .then((image) => {
 *    console.log(image)
 * })
 */
const getScreenshot = async(website) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({
    width: 1024,
    height: 768,
    deviceScaleFactor: 2
  })
  await page.goto(website)
  const location = `${tmp.fileSync().name}.png`
  await page.screenshot({
    path: location
  })
  await browser.close()
  const base64 = Buffer.from(fs.readFileSync(location)).toString('base64')
  return `data:image/png;base64,${base64}`
}

module.exports = {
  convertRemoteImageToBase64,
  getScreenshot
}