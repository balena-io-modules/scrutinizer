/*
 * Copyright 2020 balena
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
  getMarkdownSection,
  getHighlights,
  getLeftoverSections,
  getInstallationSteps,
  getTagline
} = require('../../lib/utils/markdown')

/* eslint-disable max-len */
const fullTest = `
![](https://raw.githubusercontent.com/balena-io-projects/balena-sound/master/images/balenaSound-logo.png)

**Starter project enabling you to add multi-room audio streaming via Bluetooth, Airplay or Spotify Connect to any old speakers or Hi-Fi using just a Raspberry Pi.**

# Highlights

- **Bluetooth, Airplay, Spotify Connect and UPnP**: Stream audio from your favorite music services or directly from your smartphone/computer using bluetooth or UPnP.
- **Multi-room synchronous playing**: Play perfectly synchronized audio on multiple devices all over your place.
- **Extended DAC support**: Upgrade your audio quality with one of our supported DACs

# Examples

example

# Introduction

introduction

# Motivation

motivation para _one_

**Strong** content


# Installation

1. installation step 1
2. installation step 2
3. installation step 3

footer content of the installation

# Hardware required

hardware

# Setup and configuration

Running this project is as simple as deploying it to a balenaCloud application. You can do it in just one click by using the button below:

[![](https://balena.io/deploy.png)](https://dashboard.balena-cloud.com/deploy)

# Software required

software

# Documentation

Head over to our [docs](https://sound.balenalabs.io) for detailed installation and usage instructions, customization options and more!

`
const motivationContent = `motivation para _one_

**Strong** content
`

const setupContent = `Running this project is as simple as deploying it to a balenaCloud application. You can do it in just one click by using the button below:

[![](https://balena.io/deploy.png)](https://dashboard.balena-cloud.com/deploy)
`

const readmeLeftoverContent = [
  `# Setup and configuration

Running this project is as simple as deploying it to a balenaCloud application. You can do it in just one click by using the button below:

[![](https://balena.io/deploy.png)](https://dashboard.balena-cloud.com/deploy)
`,
  `# Documentation

Head over to our [docs](https://sound.balenalabs.io) for detailed installation and usage instructions, customization options and more!
`
]

const tagline = `**Starter project enabling you to add multi-room audio streaming via Bluetooth, Airplay or Spotify Connect to any old speakers or Hi-Fi using just a Raspberry Pi.**
`

/* eslint-enable */

ava.test('given a header extracts content until next header', async(test) => {
  const response = await getMarkdownSection(fullTest, 'Motivation')
  test.is(response, motivationContent)
})

ava.test(
  'given a header extracts content until the last line',
  async(test) => {
    const response = await getMarkdownSection(
      fullTest,
      'Setup and configuration'
    )
    test.is(response, setupContent)
  }
)

ava.test('extracts highlights as list of markdown', async(test) => {
  const response = await getHighlights(fullTest)
  test.deepEqual(response, [
    {
      title: '**Bluetooth, Airplay, Spotify Connect and UPnP**',
      description:
        ' Stream audio from your favorite music services or directly from your smartphone/computer using bluetooth or UPnP.'
    },
    {
      title: '**Multi-room synchronous playing**',
      description:
        ' Play perfectly synchronized audio on multiple devices all over your place.'
    },
    {
      title: '**Extended DAC support**',
      description: ' Upgrade your audio quality with one of our supported DACs'
    }
  ])
})

ava.test('removes provided sections from markdown', async(test) => {
  const response = await getLeftoverSections(
    fullTest,
    [
      'Introduction',
      'Motivation',
      'Highlights',
      'Examples',
      'Installation',
      'Hardware required',
      'Software required'
    ],
    true
  )
  test.deepEqual(response, readmeLeftoverContent)
})

ava.test('extracts installation steps from markdown', async(test) => {
  const response = await getInstallationSteps(fullTest)

  test.deepEqual(response, {
    headers: [],
    steps: [
      'installation step 1\n',
      'installation step 2\n',
      'installation step 3\n'
    ],
    footer: 'footer content of the installation\n'
  })
})

ava.test('extracts Tagline from markdown', async(test) => {
  const response = await getTagline(fullTest)

  test.is(response, tagline)
})
