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

import { join } from 'path';
import { props } from 'bluebird';
import { getMarkdownContent } from '../utils/markdown';
import { Backend } from '../../typings/types';
import { isEmpty } from 'lodash';
export default async (backend: Backend) => {
	const files = await props({
		architecture: backend.readFile('ARCHITECTURE.md'),
		docsArchitecture: backend.readFile(join('docs', 'ARCHITECTURE.md')),
	});
	if (isEmpty(files.architecture) && isEmpty(files.docsArchitecture)) {
		return { architecture: null };
	}
	if (files.architecture) {
		return {
			architecture: await getMarkdownContent(files.architecture),
		};
	}
	if (files.docsArchitecture) {
		return {
			architecture: await getMarkdownContent(files.docsArchitecture),
		};
	}
};
