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
import { launch, LaunchOptions } from 'puppeteer';
import { fileSync } from 'tmp';
import { readFileSync } from 'fs';
import https from 'https';
import osInfo from 'linux-os-info';
import { URL } from 'url';
import BlueBirdPromise, { promisifyAll } from 'bluebird';

import { Magic, MAGIC_MIME_TYPE } from 'mmmagic';
const magic = promisifyAll(new Magic(MAGIC_MIME_TYPE));

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
	const opts: LaunchOptions = {
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

export {
	imageFileExtensions,
	convertLocalImageToBase64,
	convertRemoteImageToBase64,
	getScreenshot,
};
