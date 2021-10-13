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

import test from 'ava';
import { convertRemoteImageToBase64 } from '../lib/utils/image';

// A predictable image, with gray background
const imageUrl = 'https://via.placeholder.com/140x100';
const imageAsBase64 =
	// eslint-disable-next-line
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAABkBAMAAACm+cXiAAAAG1BMVEXMzMyWlpacnJzFxcW3t7e+vr6jo6OxsbGqqqqoPjQzAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA2ElEQVRYhe3SMQ6CQBAF0GGBQCkBrFU0sRziBcR4AJELyA2INpRUyLFdBhIoASuS/6rNL34ms0MEAAAAAACwboqJYrYO11FwO9IomCTRNTmn93AI7CB5jIIpDI/JzvlL5RC4hVMNwSR2yqRSPtGT6E21BOph7ySYMw5TaXBEsd7KJ5RAsbmRYFaNGRnst3XWtpJAP30JZtW4RT+NXvUf0yjPC7pV7PuaRbsxL3HWtB/jnF/deJVTNfN+SlZgdHcTZ92KF9xNXyNHW+svl2DBFQMAAAAAwOr9AMPbIYfChnnxAAAAAElFTkSuQmCC';

test('image: Should return the base64 representation of a remote image', async (t) => {
	const image = await convertRemoteImageToBase64(imageUrl);
	t.is(image, imageAsBase64);
});

test('image: Should return the base64 representation of a remote image using HTTP', async (t) => {
	const image = await convertRemoteImageToBase64(
		imageUrl.replace('https', 'http'),
	);
	t.snapshot(image);
});

test('image: Should not return the base64 representation of a image with relative path', async (t) => {
	try {
		await convertRemoteImageToBase64(imageUrl.replace('https://', '/'));
	} catch (error) {
		t.is(error.message, 'Invalid URL: /via.placeholder.com/140x100');
	}
});

test('image: Should not return the base64 representation of an empty string', async (t) => {
	try {
		await convertRemoteImageToBase64();
	} catch (error) {
		t.is(error.message, 'Invalid URL: ');
	}
});
