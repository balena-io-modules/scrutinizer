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

import ava from 'ava';
import {
	getMarkdownSection,
	getHighlights,
	getLeftoverSections,
	getInstallationSteps,
	getTagline,
} from '../../lib/utils/markdown';

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

`;
/* eslint-enable */

ava('given a header extracts content until next header', async (t) => {
	const response = await getMarkdownSection(fullTest, 'Motivation');
	t.snapshot(response);
});

ava('given a header extracts content until the last line', async (t) => {
	const response = await getMarkdownSection(
		fullTest,
		'Setup and configuration',
	);
	t.snapshot(response);
});

ava('extracts highlights as list of markdown', async (t) => {
	const response = await getHighlights(fullTest);
	t.snapshot(response);
});

ava('removes provided sections from markdown', async (t) => {
	const response = await getLeftoverSections(fullTest, [
		'Introduction',
		'Motivation',
		'Highlights',
		'Examples',
		'Installation',
		'Hardware required',
		'Software required',
	]);
	t.snapshot(response);
});

ava('extracts installation steps from markdown', async (t) => {
	const response = await getInstallationSteps(fullTest);

	t.snapshot(response);
});

ava('extracts Tagline from markdown', async (t) => {
	const response = await getTagline(fullTest);

	t.snapshot(response);
});
