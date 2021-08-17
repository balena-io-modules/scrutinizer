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

import { map, props } from 'bluebird';
import { tail, findIndex, last } from 'lodash';
import { markdown } from 'markdown';
import { Backend } from '../../typings/types';
import { getScreenshot } from '../utils/image';
import {
	getMarkdownSection,
	getHighlights,
	getLeftoverSections,
	getInstallationSteps,
	getLeftoverReadme,
	getTagline,
} from '../utils/markdown';

declare type markdownNode = [
	string,
	string | markdownNode | { level?: string; href?: string },
];

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
const getExamples = async (
	readme: string,
): Promise<Array<{
	name: string;
	website: string;
	description: string;
	screenshot: string;
}> | null> => {
	const content = await getMarkdownSection(readme, 'Examples');
	if (!content) {
		return null;
	}
	const tree: markdownNode[] = tail(markdown.parse(content));

	// eslint-disable-next-line lodash/matches-prop-shorthand
	const listIndex = findIndex(tree, (node) => {
		return node[0] === 'bulletlist';
	});

	if (listIndex === -1) {
		return null;
	}

	const examples = await map(
		tail(tree[listIndex] as markdownNode[]),
		async (highlight: markdownNode) => {
			const websiteUrl = (highlight as Array<Array<{ href: string }>>).slice(
				1,
			)[0][1].href;

			return {
				name: last((highlight as string[]).slice(1)[0]) as string,
				website: websiteUrl as string,
				description: (highlight as string[])
					.slice(1)[1]
					.replace(' - ', '') as string,
				screenshot: await getScreenshot(websiteUrl),
			};
		},
	);

	return examples;
};

export default async (backend: Backend) => {
	const { readme } = await props({
		readme: backend.readFile('README.md'),
	});

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
			license: null,
		};
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
		leftoverSections: await getLeftoverSections(readme, [
			'Introduction',
			'Motivation',
			'Highlights',
			'Examples',
			'Installation',
			'Hardware required',
			'Software required',
			'Setup and configuration',
		]),
		readmeLeftover: await getLeftoverReadme(readme),
	};
};
