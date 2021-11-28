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

import { load } from 'js-yaml';
import { isEmpty } from 'lodash';
import { Backend } from '../../typings/types';

export default async (backend: Backend) => {
	const contents = await backend.readFile('.versionbot/CHANGELOG.yml');
	if (isEmpty(contents)) {
		const markdown = await backend.readFile('CHANGELOG.md');
		if (isEmpty(markdown)) {
			return {
				changelog: [],
			};
		}

		return {
			changelog: markdown,
		};
	}
	const changelog = load(contents);
	return {
		changelog,
	};
};
