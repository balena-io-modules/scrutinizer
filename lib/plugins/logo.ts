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

import { props } from 'bluebird';
import { Backend } from '../../typings/types';
import { getLogoFromUrl } from '../utils/image';
import {
	convertHtmlToMD,
	getFirstImageIndex,
	isParagraph,
	markdownAST,
} from '../utils/markdown';

export default async (backend: Backend) => {
	const files = await props({
		readme: backend.readFile('README.md'),
	});
	const convertedMarkdown = await convertHtmlToMD(files.readme);
	// TODO: We are converting again here. Ideally we should we dealing it with a
	// unified plugin. Refactor when possible
	const mdast = markdownAST(convertedMarkdown);

	if (!mdast.children) {
		return { logo: null };
	}
	const imageIndex = getFirstImageIndex(mdast);

	let imageUrl;
	if (imageIndex !== -1) {
		imageUrl = isParagraph(mdast.children[imageIndex])
			? mdast.children[imageIndex].children?.[0].url
			: mdast.children[imageIndex].url;
	}

	if (imageUrl) {
		const logo = await getLogoFromUrl(imageUrl, backend);
		return { logo };
	}

	return { logo: null };
};
