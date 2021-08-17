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

import { get, isEmpty, some, endsWith } from 'lodash';
import { Backend } from '../../typings/types';
import { getArch, getOS, getInstallerType } from '../utils/releases';

const EXTENSIONS_TO_EXCLUDE = [
	'.blockmap',
	'.yaml',
	'.yml',
	'.txt',
	'SHASUMS256',
	'AppImage',
	'.deb',
	'rpm',
];

export default async (backend: Backend) => {
	const latestRelease = await backend.getLatestRelease();
	let assets = get(latestRelease, ['asssets']);
	if (isEmpty(assets)) {
		return { latestRelease: null };
	}
	// Filter out irrelevant assets
	assets = assets.filter((asset: { name: string | undefined }) => {
		return !some(EXTENSIONS_TO_EXCLUDE, (extension) => {
			return endsWith(asset.name, extension);
		});
	});
	assets = assets.map((asset: { name: string }) => {
		const str = asset.name.toLowerCase();
		return {
			...asset,
			os: getOS(str),
			arch: getArch(str),
			installerType: getInstallerType(str),
		};
	});
	// TODO: Fix this annoying typo in a new major release
	latestRelease.asssets = assets;
	return {
		latestRelease,
	};
};
