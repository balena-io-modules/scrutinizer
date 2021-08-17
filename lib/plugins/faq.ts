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

import { props } from 'bluebird';
import { markdown } from 'markdown';
import { isEmpty, tail, findIndex, first, last } from 'lodash';
import { Backend } from '../../typings/types';

declare type markdownNode = [string, string | markdownNode | { level: string }];
export default async (backend: Backend) => {
	const { faq } = await props({
		faq: backend.readFile('FAQ.md'),
	});
	if (isEmpty(faq)) {
		return { faq: null };
	}
	const tree: markdownNode[] = tail(markdown.parse(faq));
	const result: Array<{ title: string; content: string }> = [];
	tree.forEach((node: markdownNode, index) => {
		if (node[0] === 'header') {
			const rest = tree.slice(index + 1);
			const endIndex = findIndex(rest, (nextNode) => {
				return (
					first(node) === 'header' &&
					(nextNode[1] as { level: string }).level ===
						(node[1] as { level: string })?.level
				);
			});

			const content =
				endIndex === -1
					? (rest as unknown as string)
					: (rest.slice(0, endIndex) as unknown as string);

			result.push({
				title: last(node) as string,
				content,
			});
		}
	});
	return { faq: result };
};
