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

import { map } from 'bluebird';
import { isEmpty } from 'lodash';
import { Backend } from '../../typings/types';
import {
	embedImagesIntoMarkdownAsBase64,
	getMarkdownContent,
	getTableOfContent,
} from '../utils/markdown';

export default async (backend: Backend) => {
	const paths = await backend.readDirectoryFilePaths('docs');
	if (isEmpty(paths)) {
		return {
			docs: [],
		};
	}
	const docs = await map(paths, async (path: string) => {
		const doc = await backend.readFile(path);
		const contentsWithImages = await embedImagesIntoMarkdownAsBase64(
			backend,
			doc,
			'docs',
		);
		const contents = await getMarkdownContent(contentsWithImages);

		const tableOfContent = (await getTableOfContent(doc)) || [];
		return {
			filename: path,
			contents,
			tableOfContent,
		};
	});
	return {
		docs,
	};
};
