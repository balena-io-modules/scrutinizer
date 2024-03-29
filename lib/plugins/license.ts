/*
 * Copyright 2018 resin.io
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

import { Backend } from '../../typings/types';

export default async (backend: Backend) => {
	const packageJSON = await backend.readFile('package.json');
	if (packageJSON) {
		const npmLicense = JSON.parse(packageJSON).license;

		if (npmLicense) {
			return {
				license: npmLicense,
			};
		}
	}
	const licenseFile = await backend.readFile('LICENSE');
	if (licenseFile && /Apache License/gi.test(licenseFile)) {
		return {
			license: 'Apache-2.0',
		};
	}
	return {
		license: 'Other',
	};
};
