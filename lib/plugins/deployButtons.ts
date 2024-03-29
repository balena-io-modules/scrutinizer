/*
 * Copyright 2020 balena
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
import { hasDeployButton } from '../utils/markdown';

const DEPLOY_WITH_BALENA_URL = 'https://dashboard.balena-cloud.com/deploy';

export default async (backend: Backend) => {
	const files = await props({
		readme: backend.readFile('README.md'),
	});
	const repoUrl = await backend.getRepositoryUrl();
	if (!repoUrl || !files.readme) {
		return { deployWithBalenaUrl: null };
	}

	return {
		deployWithBalenaUrl: hasDeployButton(files.readme, DEPLOY_WITH_BALENA_URL)
			? `${DEPLOY_WITH_BALENA_URL}?repoUrl=${repoUrl}`
			: null,
	};
};
