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

import ava from 'ava';
import { map, each } from 'lodash';
import { readdirSync } from 'fs';
import { join } from 'path';
import { local, remote } from '../lib';

const CASES = map(readdirSync(join(__dirname, 'e2e')), (testCase: string) => {
	return require(join(__dirname, 'e2e', testCase));
});

each(
	CASES,
	(testCase: {
		name: string;
		reference: any;
		plugins: any;
		result: any;
		url: string;
		testIndex: number;
	}) => {
		const repositoryPath = join(__dirname, 'repositories', testCase.name);

		const logProgress = (state: { percentage: any }) => {
			console.log(`${repositoryPath} -> ${state.percentage}%`);
		};

		ava(
			`local: ${testCase.name} (${testCase.reference}) - ${testCase.testIndex}`,
			async (t) => {
				const data = await local(repositoryPath, {
					reference: testCase.reference,
					progress: logProgress,
					whitelistPlugins: testCase.plugins,
				});
				t.deepEqual(data, testCase.result);
			},
		);

		ava(
			`remote: ${testCase.name} (${testCase.reference}) - ${testCase.testIndex}`,
			async (t) => {
				const data = await remote(testCase.url, {
					reference: testCase.reference,
					progress: logProgress,
					whitelistPlugins: testCase.plugins,
				});
				t.deepEqual(data, testCase.result);
			},
		);
	},
);
