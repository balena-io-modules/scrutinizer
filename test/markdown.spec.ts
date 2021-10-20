import test from 'ava';

import {
	extractMetaData,
	getSections,
	getTableOfContent,
} from '../lib/utils/markdown';

const content = `
# heading one

## heading two

### heading three
`;

const fullText = `
pre text

## Why balenaSound?
We wanted to create an open source alternative to existing audio streaming commercial products that was not tied to a vendor or platform. balenaSound is the product of that. balenaSound is free, secure and fully customizable! You can pick the features that suit you and leave those that don't behind, resting asured that your device will keep on working no matter what.

## Is balenaSound free? blank para test

## Is balenaSound free?
Yes! balenaSound requires you to sign up for a free [balenaCloud](https://dashboard.balena-cloud.com/signup) account. Your first 10 devices are always
free and full-featured.

## Privacy: is balenaSound secure?
balenaSound does not not depend on any type of cloud service to deliver a great experience. Other than that, your device will be running balenaOS which does communicate with balenaCloud to get application updates. This can be disabled however and won't affect your experience. Both [balenaSound](https://github.com/balenalabs/balena-sound/) and [balenaOS](https://github.com/balena-os) are open source projects, so feel free to check the source code if you want to know more about how they work!

balenaSound does not not depend on any type of cloud service to deliver a great experience. Other than that, your device will be running balenaOS which does communicate with balenaCloud to get application updates. This can be disabled however and won't affect your experience. Both [balenaSound](https://github.com/balenalabs/balena-sound/) and [balenaOS](https://github.com/balena-os) are open source projects, so feel free to check the source code if you want to know more about how they work!

## Does balenaSound need internet access?
`;

const fullTextWithMetaData = `---
title: yes
list:
  - item 1
  - item 2
date: 2021-12-06
---

pre text

## Why balenaSound?
We wanted to create an open source alternative to existing audio streaming commercial products that was not tied to a vendor or platform. balenaSound is the product of that. balenaSound is free, secure and fully customizable! You can pick the features that suit you and leave those that don't behind, resting asured that your device will keep on working no matter what.

## Is balenaSound free? blank para test

## Is balenaSound free?
Yes! balenaSound requires you to sign up for a free [balenaCloud](https://dashboard.balena-cloud.com/signup) account. Your first 10 devices are always
free and full-featured.

## Privacy: is balenaSound secure?
balenaSound does not not depend on any type of cloud service to deliver a great experience. Other than that, your device will be running balenaOS which does communicate with balenaCloud to get application updates. This can be disabled however and won't affect your experience. Both [balenaSound](https://github.com/balenalabs/balena-sound/) and [balenaOS](https://github.com/balena-os) are open source projects, so feel free to check the source code if you want to know more about how they work!

balenaSound does not not depend on any type of cloud service to deliver a great experience. Other than that, your device will be running balenaOS which does communicate with balenaCloud to get application updates. This can be disabled however and won't affect your experience. Both [balenaSound](https://github.com/balenalabs/balena-sound/) and [balenaOS](https://github.com/balena-os) are open source projects, so feel free to check the source code if you want to know more about how they work!

## Does balenaSound need internet access?
`;

test('returns a table of content', async (t) => {
	const result = await getTableOfContent(content);

	t.snapshot(result);
});

test('lists all the level 2 sections', async (t) => {
	const result = await getSections(fullText);

	t.snapshot(result);
});

test('extracts metadata from markdown', async (t) => {
	const results = await extractMetaData(fullTextWithMetaData);

	t.snapshot(results);
});
