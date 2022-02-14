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

import http from 'http';
import { BrowserLaunchArgumentOptions, launch, LaunchOptions } from 'puppeteer';
import { fileSync } from 'tmp';
import { readFileSync } from 'fs';
import https from 'https';
import osInfo from 'linux-os-info';
import { URL } from 'url';
import BlueBirdPromise, { promisifyAll, props } from 'bluebird';
import { Backend } from '../../typings/types';
import { name } from '../../package.json';

import { Magic, MAGIC_MIME_TYPE } from 'mmmagic';
const magic = promisifyAll(new Magic(MAGIC_MIME_TYPE));

import { isString } from 'lodash';

import { recognize, setLogging } from 'tesseract.js';
import sharp from 'sharp';
import debug from 'debug';
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
const convertRemoteImageToBase64 = (
	imagePath: string = '',
): Promise<string> => {
	const url = new URL(imagePath);

	// https://nodejs.org/api/https.html#https_https
	const client = url.protocol === 'https:' ? https : http;

	return new BlueBirdPromise((resolve, reject) => {
		return client
			.get(imagePath, (res) => {
				res.setEncoding('base64');

				// Prepare the prefix, e.g. data:image/jpeg;base64,
				let body = `data:${res.headers['content-type']};base64,`;

				// Build the body
				res.on('data', (data) => {
					body += data;
				});

				res.on('end', () => {
					resolve(body);
				});
			})
			.on('error', (err) => {
				reject(err);
			});
	});
};

/**
 * @summary Get the base64 representation of a image blob
 * @function
 * @public
 *
 * @param {File} imageData - FileData of an image
 * @param {String} format - File encoding
 * @returns {Promise}
 *
 * @example
 * convertLocalImageToBase64(File)
 *  .then((imageAsBase64) => {
 *    console.log(imageAsBase64)
 * })
 */
const convertLocalImageToBase64 = async (
	imageData: string,
	format: BufferEncoding = 'utf-8',
): Promise<string> => {
	const buffer = Buffer.from(imageData, format);
	const mimeType = await magic.detectAsync(buffer);
	return `data:${mimeType};base64,${buffer.toString('base64')}`;
};

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
const getScreenshot = async (website: string): Promise<string> => {
	const info = await osInfo();
	const opts: BrowserLaunchArgumentOptions & LaunchOptions = {
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};
	if (info.name === 'Alpine') {
		opts.executablePath = '/usr/bin/chromium-browser';
	}
	const browser = await launch(opts);
	const page = await browser.newPage();
	await page.setViewport({
		width: 1024,
		height: 768,
		deviceScaleFactor: 2,
	});
	await page.goto(website);
	const location = `${fileSync().name}.png`;
	await page.screenshot({
		path: location,
	});
	await browser.close();
	const base64 = Buffer.from(readFileSync(location)).toString('base64');
	return `data:image/png;base64,${base64}`;
};

const imageFileExtensions = [
	'apng',
	'png',
	'webp',
	'ico',
	'cur',
	'jpg',
	'jpeg',
	'jfif',
	'pjpeg',
	'pjp',
	'bmp',
	'svg',
	'tiff',
	'tif',
];

export const mimeTypes = {
	apng: 'image/apng',
	png: 'image/png',
	avif: 'image/avif',
	gif: 'image/gif',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	jfif: 'image/jpeg',
	pjpeg: 'image/jpeg',
	pjp: 'image/jpeg',
	svg: 'image/svg+xml',
	webp: 'image/webp',
};

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
export const isAbsoluteUrl = (url: string): boolean => {
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
	setLogging(true);

	const {
		data: { text },
	} = await recognize(imageUrl, 'eng', { logger: debug(`${name}`) });
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
export const getLogoFromUrl = async (
	imageUrl: string,
	backend: Backend,
	org?: boolean,
): Promise<{ base64: string; textContent: string | null } | null> => {
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
			logo: org
				? backend.readOrgFile(localImageUrl)
				: backend.readFile(localImageUrl),
		});
		if (!files.logo) {
			return null;
		}
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
		base64: base64Image,
		textContent: logoText,
	};
};

export {
	imageFileExtensions,
	convertLocalImageToBase64,
	convertRemoteImageToBase64,
	getScreenshot,
};
