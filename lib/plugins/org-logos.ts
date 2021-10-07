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

import { Magic as _Magic, MAGIC_MIME_TYPE } from 'mmmagic';
const Magic = _Magic;
const magic = promisifyAll(new Magic(MAGIC_MIME_TYPE));

import { recognize } from 'tesseract.js';
import sharp from 'sharp';
import { Backend } from '../../typings/types';

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
	image: string,
): Promise<{ base64: string; textContent: string | null }> => {
	let logoText = null;
	let base64Image = null;

	let buffer = Buffer.from(image, 'base64');
	const mimeType = await magic.detectAsync(buffer);
	base64Image = `data:${mimeType};base64,${image}`;
	if (mimeType === 'image/svg') {
		buffer = await sharp(buffer).png().toBuffer();
		base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;
	}
	logoText = await detectTextFromImage(buffer);

	return {
		base64: base64Image,
		textContent: logoText,
	};
};

export default async (backend: Backend) => {
	const files = await props({
		svg_full_logo: backend.readOrgFile('logo_full.svg'),
		png_full_logo: backend.readOrgFile('logo_full.png'),
		svg_logo_brandmark: backend.readOrgFile('logo.svg'),
		png_logo_brandmark: backend.readOrgFile('logo.png'),
	});
	let svgFullLogo = null;
	let svgLogoBrandmark = null;
	let pngFullLogo = null;
	let pngLogoBrandmark = null;

	svgFullLogo = files.svg_full_logo
		? await getLogoFromUrl(files.svg_full_logo)
		: null;

	if (!svgFullLogo) {
		pngFullLogo = files.png_full_logo
			? await getLogoFromUrl(files.png_full_logo)
			: null;
	}

	svgLogoBrandmark = files.svg_logo_brandmark
		? await getLogoFromUrl(files.svg_logo_brandmark)
		: null;

	if (!svgLogoBrandmark) {
		pngLogoBrandmark = files.png_logo_brandmark
			? await getLogoFromUrl(files.png_logo_brandmark)
			: null;
	}

	return {
		orgLogoFull: svgFullLogo || pngFullLogo || null,
		orgLogoBrandmark: svgLogoBrandmark || pngLogoBrandmark || null,
	};
};
