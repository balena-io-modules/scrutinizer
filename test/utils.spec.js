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

const ava = require('ava')
const {
  formatRelativeImagePaths
} = require('../lib/utils/markdown')

ava.test('markdown: Should transform a relative image path with forward slash', (test) => {
  const originalString = '![image](/images/hello.png)'
  const pathPrefix = 'https://raw.githubusercontent.com/balena-io-modules/scrutinizer'

  const transformedString = formatRelativeImagePaths(
    originalString,
    pathPrefix
  )

  test.is(
    transformedString,
    '![image](https://raw.githubusercontent.com/balena-io-modules/scrutinizer/master/images/hello.png)'
  )
})

ava.test('markdown: Should transform a relative image path without forward slash', (test) => {
  const originalString = '![image](images/hello.png)'
  const pathPrefix = 'https://raw.githubusercontent.com/balena-io-modules/scrutinizer'

  const transformedString = formatRelativeImagePaths(
    originalString,
    pathPrefix
  )

  test.is(
    transformedString,
    '![image](https://raw.githubusercontent.com/balena-io-modules/scrutinizer/master/images/hello.png)'
  )
})

ava.test('markdown: Should not transform an absolute image path', (test) => {
  const originalString = '![image](https://balena.io/images/hello.png)'
  const pathPrefix = 'https://raw.githubusercontent.com/balena-io-modules/scrutinizer'

  const transformedString = formatRelativeImagePaths(
    originalString,
    pathPrefix
  )

  test.is(transformedString, originalString)
})

ava.test('markdown: Should only transform the single relative image path', (test) => {
  const originalString =
    '![image](./images/hello.png) ![image](https://balena.io/images/hello.png) ##Header [Link](#Link) <img src="https://github.com/balena-io-modules/scrutinizer/raw/master/docs/images/image.png" />'
  const pathPrefix = 'https://raw.githubusercontent.com/balena-io-modules/scrutinizer'

  const transformedString = formatRelativeImagePaths(
    originalString,
    pathPrefix
  )

  test.is(
    transformedString,
    '![image](https://raw.githubusercontent.com/balena-io-modules/scrutinizer/master/images/hello.png) ![image](https://balena.io/images/hello.png) ##Header [Link](#Link) <img src="https://github.com/balena-io-modules/scrutinizer/raw/master/docs/images/image.png" />'
  )
})

ava.test(
  'markdown: Should not apply any transformations if the repo URL is missing',
  (test) => {
    const originalString = '![image](/images/hello.png)'

    const transformedString = formatRelativeImagePaths(originalString)

    test.is(transformedString, originalString)
  }
)
