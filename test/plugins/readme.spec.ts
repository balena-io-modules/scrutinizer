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
const motivationContent = `motivation para _one_

**Strong** content
`;

const setupContent = `Running this project is as simple as deploying it to a balenaCloud application. You can do it in just one click by using the button below:

[![](https://balena.io/deploy.png)](https://dashboard.balena-cloud.com/deploy)
`;

const readmeLeftoverContent = [
	{
		title: `# [](#setup-and-configuration)Setup and configuration
`,
		description: `Running this project is as simple as deploying it to a balenaCloud application. You can do it in just one click by using the button below:

[![](https://balena.io/deploy.png)](https://dashboard.balena-cloud.com/deploy)
`,
	},
	{
		title: `# [](#documentation)Documentation
`,
		description: `Head over to our [docs](https://sound.balenalabs.io) for detailed installation and usage instructions, customization options and more!
`,
	},
];

const tagline = `**Starter project enabling you to add multi-room audio streaming via Bluetooth, Airplay or Spotify Connect to any old speakers or Hi-Fi using just a Raspberry Pi.**
`;

/* eslint-enable */

ava('given a header extracts content until next header', async (t) => {
	const response = await getMarkdownSection(fullTest, 'Motivation');
	t.is(response, motivationContent);
});

ava('given a header extracts content until the last line', async (t) => {
	const response = await getMarkdownSection(
		fullTest,
		'Setup and configuration',
	);
	t.is(response, setupContent);
});

ava('extracts highlights as list of markdown', async (t) => {
	const response = await getHighlights(fullTest);
	t.deepEqual(response, [
		{
			title: '**Bluetooth, Airplay, Spotify Connect and UPnP**',
			description:
				' Stream audio from your favorite music services or directly from your smartphone/computer using bluetooth or UPnP.',
		},
		{
			title: '**Multi-room synchronous playing**',
			description:
				' Play perfectly synchronized audio on multiple devices all over your place.',
		},
		{
			title: '**Extended DAC support**',
			description: ' Upgrade your audio quality with one of our supported DACs',
		},
	]);
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
	t.deepEqual(response, readmeLeftoverContent);
});

ava('extracts installation steps from markdown', async (t) => {
	const response = await getInstallationSteps(fullTest);

	t.deepEqual(response, {
		headers: [],
		steps: [
			'installation step 1\n',
			'installation step 2\n',
			'installation step 3\n',
		],
		footer: 'footer content of the installation\n',
	});
});

ava('extracts Tagline from markdown', async (t) => {
	const response = await getTagline(fullTest);

	t.is(response, tagline);
});
