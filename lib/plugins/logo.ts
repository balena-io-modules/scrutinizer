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

import { promisifyAll, props } from 'bluebird';
import { isString } from 'lodash';

import { convertRemoteImageToBase64, mimeTypes } from '../utils/image';
import { Magic as _Magic, MAGIC_MIME_TYPE } from 'mmmagic';
const Magic = _Magic;
const magic = promisifyAll(new Magic(MAGIC_MIME_TYPE));

import { recognize } from 'tesseract.js';
import sharp from 'sharp';
import { Backend } from '../../typings/types';
import {
	convertHtmlToMD,
	getFirstImageIndex,
	isParagraph,
	markdownAST,
} from '../utils/markdown';

const absoluteUrlRe = new RegExp('^(?:[a-z]+:)?//', 'i');

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
const isAbsoluteUrl = (url: string): boolean => {
	return absoluteUrlRe.test(url);
};

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
const detectTextFromImage = async (
	imageUrl: string | Buffer,
): Promise<string | null> => {
	const {
		data: { text },
	} = await recognize(imageUrl, 'eng');
	return text && text.length >= 3 ? text : null;
};

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
const base64MimeType = (
	encoded: string,
): { mimeType: string | null; data: string } => {
	if (!isString(encoded)) {
		return { mimeType: null, data: encoded };
	}

	const regexMatch = encoded.match(
		/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,(.*)/,
	);

	if (!regexMatch) {
		return { mimeType: null, data: encoded };
	}

	return { mimeType: regexMatch[1], data: regexMatch[2] };
};
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
const getLogoFromUrl = async (
	imageUrl: string,
	backend: Backend,
): Promise<{ logo: { base64: string; textContent: string | null } }> => {
	let logoText = null;
	let base64Image = null;

	if (isAbsoluteUrl(imageUrl)) {
		base64Image = await convertRemoteImageToBase64(imageUrl);
		const { mimeType, data } = base64MimeType(base64Image);
		let buffer = Buffer.from(data, 'base64');
		if (mimeType === 'image/svg' || mimeType === 'image/svg+xml') {
			buffer = await sharp(buffer).png().toBuffer();
			base64Image = `data:image/png;base64,${buffer.toString('base64')}`;
		}
		logoText = await detectTextFromImage(buffer);
	} else {
		let localImageUrl: string = imageUrl;
		if (imageUrl.startsWith('./')) {
			localImageUrl = imageUrl.replace('./', '');
		}

		// The image is local to the repo so we can fetch it via the backend
		const files = await props({
			logo: backend.readFile(localImageUrl),
		});
		let buffer = Buffer.from(files.logo, 'base64');

		const mimeType = localImageUrl.split('.').reverse()[0]
			? mimeTypes[
					localImageUrl.split('.').reverse()[0] as keyof typeof mimeTypes
			  ]
			: await magic.detectAsync(buffer);
		base64Image = `data:${mimeType};base64,${files.logo}`;
		if (mimeType === 'image/svg' || mimeType === 'image/svg+xml') {
			buffer = await sharp(buffer).png().toBuffer();
			base64Image = `data:image/png;base64,${buffer.toString('base64')}`;
		}
		logoText = await detectTextFromImage(buffer);
	}

	return {
		logo: {
			base64: base64Image,
			textContent: logoText,
		},
	};
};

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
		const { logo } = await getLogoFromUrl(imageUrl, backend);
		return { logo };
	}

	return { logo: null };
};
