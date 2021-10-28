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

import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remark2rehype from 'remark-rehype';
import raw from 'rehype-raw';
import rehype2remark from 'rehype-remark';
import Slugger from 'github-slugger';
import convert from 'unist-util-is/convert';
import toString from 'mdast-util-to-string';
import visit from 'unist-util-visit';
import remarkFrontmatter from 'remark-frontmatter';
import yaml from 'yaml';

export interface Node {
	type: string;
	children?: Node[];
	value?: string;
	url?: string;
	depth?: number;
	ordered?: boolean;
	data?: {
		hProperties?: {
			id: string;
		};
	};
}

export const markdownAST = (content: string): Node => {
	return unified().use(remarkParse, { gfm: true }).parse(content);
};

/**
 * @summary return if node is a heading
 * @function
 * @private
 *
 * @param {Object} node - markdown node
 * @returns {Boolean}
 *
 * @example
 * isHeading(node)
 */
const isHeading = (node: Node): boolean => {
	return node.type === 'heading';
};

/**
 * @summary return if node is a paragraph
 * @function
 * @private
 *
 * @param {Object} node - markdown node
 * @returns {Boolean}
 *
 * @example
 * isHeading(node)
 */
export const isParagraph = (node: Node): boolean => {
	return node.type === 'paragraph';
};

/**
 * @summary return if node is an image
 * @function
 * @private
 *
 * @param {Object} node - markdown node
 * @returns {Boolean}
 *
 * @example
 * isHeading(node)
 */
const isImage = (node: Node): boolean => {
	return node.type === 'image';
};

/**
 * @summary return if node is bold/strong
 * @function
 * @private
 *
 * @param {Object} node - markdown node
 * @returns {Boolean}
 *
 * @example
 * isHeading(node)
 */
const isBold = (node: Node): boolean => {
	return node.type === 'strong';
};

/**
 * @summary unify content as only markdown, converting html into md.
 * @function
 * @private
 *
 * @param {String} markdown - markdown content
 * @returns {Promise}
 *
 * @example
 * convertHtmlToMD(markdown).then(md => console.log(md))
 */
const convertHtmlToMD = async (markdown: string): Promise<any> => {
	return unified()
		.use(remarkParse, { gfm: true })
		.use(remark2rehype, { allowDangerousHtml: true })
		.use(raw)
		.use(rehype2remark)
		.use(remarkStringify)
		.process(markdown);
};

/**
 * @summary Get section from Readme
 * @function
 * @private
 *
 * @param {String} readme - Readme file
 * @param {String} heading - Section name
 * @returns {String}
 *
 * @example
 * getMarkdownSection(readme, section)
 */
const getMarkdownSection = async (
	readme: string,
	heading: string,
): Promise<string> => {
	const convertedMarkdown = await convertHtmlToMD(readme);

	const mdast = unified()
		.use(remarkParse, { gfm: true })
		.parse(convertedMarkdown) as unknown as { children: Node[] };

	const startIndex = mdast.children.findIndex((node) => {
		return (
			isHeading(node) &&
			node?.children?.some((childNode) => {
				return (
					childNode.value &&
					childNode.value.toLowerCase() === heading.toLowerCase()
				);
			})
		);
	});

	if (startIndex === -1) {
		return '';
	}

	const restTree = mdast.children.slice(startIndex + 1);

	let lastIndex = restTree.findIndex((node) => {
		return isHeading(node) && node.depth === mdast.children[startIndex].depth;
	});

	if (lastIndex === -1) {
		lastIndex = restTree.length - 1;
	}

	const tree = {
		type: 'root',
		children: mdast.children.slice(startIndex + 1, startIndex + lastIndex + 1),
	};

	return unified().use(remarkStringify).stringify(tree);
};

/**
 * @summary Get highlights from Readme
 * @function
 * @private
 *
 * @param {String} readme - Readme file
 * @returns {Object}
 *
 * @example
 * getHighlights(readme)
 */
const getHighlights = async (
	readme: string,
): Promise<Array<{ title: string; description: string }> | string> => {
	const content = await getMarkdownSection(readme, 'Highlights');

	const mdast = unified()
		.use(remarkParse, { gfm: true })
		.parse(content) as unknown as { children: Node[] };

	const listIndex = mdast.children.findIndex((node) => {
		return node.type === 'list';
	});

	if (listIndex === -1) {
		return '';
	}

	return mdast?.children[listIndex]?.children
		?.map((highlight) => {
			return {
				title: highlight.children?.[0]?.children?.[0],
				description: highlight.children?.[0]?.children?.[1],
			};
		})
		.map((highlight) => {
			return {
				title: unified()
					.use(remarkStringify)
					.stringify(highlight.title as any),
				description:
					unified()
						.use(remarkStringify)
						.stringify(highlight.description as any) || '',
			};
		})
		.map((highlight) => {
			return {
				title: highlight.title,
				description: highlight.description.startsWith(':')
					? highlight.description.replace(':', '')
					: highlight.description,
			};
		}) as Array<{ title: string; description: string }>;
};

/**
 *
 * @summary Returns bold line after the first image(Logo) in the Markdown
 * @function
 * @private
 *
 * @param {String} readme - markdown file
 * @returns {Object}
 *
 * @example
 * getTagline(markdown)
 */
const getTagline = async (readme: string): Promise<string> => {
	const content = await convertHtmlToMD(readme);

	const mdast = unified()
		.use(remarkParse, { gfm: true })
		.parse(content) as unknown as { children: Node[] };

	const imageIndex = mdast.children.findIndex((node) => {
		return (
			isParagraph(node) &&
			node.children?.some((childNode) => {
				return isImage(childNode);
			})
		);
	});

	if (imageIndex !== -1) {
		mdast.children = mdast.children?.slice(imageIndex + 1, imageIndex + 2);
	}

	const taglineIndex = mdast.children?.findIndex((node) => {
		return (
			isParagraph(node) &&
			node.children?.some((childNode) => {
				return isBold(childNode);
			})
		);
	});

	if (taglineIndex !== -1) {
		return unified()
			.use(remarkStringify)
			.stringify(mdast as any);
	}

	return '';
};

/**
 * @summary Remove sections from readme
 * @function
 * @private
 *
 * @param {String} readme - Readme file
 * @param {String[]} sections - List of sections to remove
 * @returns {Object}
 *
 * @example
 * getReadmeLeftover(readme,sections)
 */
const getLeftoverSections = async (
	readme: string,
	sections: string[],
): Promise<Array<{ title: string; description: string }> | string> => {
	const content = await convertHtmlToMD(readme);

	const mdast = unified()
		.use(remarkParse, { gfm: true })
		.parse(content) as unknown as { children: Node[] };

	sections.forEach((section) => {
		const sectionStartIndex = mdast.children.findIndex((node) => {
			return (
				isHeading(node) &&
				node.children?.some((child) => {
					return (
						child.value && child.value.toLowerCase() === section.toLowerCase()
					);
				})
			);
		});

		if (sectionStartIndex === -1) {
			return;
		}

		const sectionHeader = mdast.children[sectionStartIndex];
		const sectionRest = mdast.children.slice(sectionStartIndex + 1);
		let sectionEndIndex = sectionRest.findIndex((node) => {
			return isHeading(node) && node.depth === sectionHeader.depth;
		});

		if (sectionEndIndex === -1) {
			sectionEndIndex = sectionRest.length - 1;
		}

		mdast.children.splice(sectionStartIndex, sectionEndIndex + 1);
	});

	const imageIndex = mdast.children.findIndex((node) => {
		return (
			isParagraph(node) &&
			node.children?.some((childNode) => {
				return isImage(childNode);
			})
		);
	});

	if (imageIndex !== -1) {
		mdast.children.splice(imageIndex, 1);
	}

	const leftoverSections = [];
	let startIndex = null;
	let header: Node | null = null;
	let rest = null;
	let endIndex = null;
	while (startIndex !== -1) {
		startIndex = mdast.children.findIndex((node) => {
			return isHeading(node);
		});

		if (startIndex === -1) {
			break;
		}
		header = mdast.children[startIndex];
		rest = mdast.children.slice(startIndex + 1);
		// eslint-disable-next-line no-loop-func
		endIndex = rest.findIndex((node) => {
			return isHeading(node) && node.depth === header?.depth;
		});

		if (endIndex === -1) {
			endIndex = rest.length + 1;
		}

		leftoverSections.push({
			title: mdast.children.splice(startIndex, 1),
			description: mdast.children.splice(startIndex, endIndex),
		});
	}

	return leftoverSections.map((section) => {
		return {
			title: unified()
				.use(remarkStringify)
				.stringify({ type: 'root', children: section.title }),
			description: unified()
				.use(remarkStringify)
				.stringify({ type: 'root', children: section.description }),
		};
	});
};

/**
 *
 * @summary Get installation steps from markdown
 * @function
 * @private
 *
 * @param {String} markdown - markdown file
 * @returns {Object}
 *
 * @example
 * getInstallationSteps(markdown)
 */
const getInstallationSteps = async (
	markdown: string,
): Promise<{ headers: string[]; steps: any[]; footer: string } | null> => {
	const content = await getMarkdownSection(markdown, 'Installation');

	if (!content) {
		return null;
	}

	const mdast = unified()
		.use(remarkParse, { gfm: true })
		.parse(content) as unknown as { children: Node[] };

	let steps = [];

	let footer = null;

	const listIndex = mdast.children.findIndex((node) => {
		return node.type === 'list' && node.ordered;
	});

	if (listIndex === -1) {
		return null;
	}

	steps = mdast.children?.[listIndex]?.children?.map((listNode) => {
		return unified()
			.use(remarkStringify)
			.stringify({ type: 'root', children: listNode.children });
	}) as any[];

	footer = unified()
		.use(remarkStringify)
		.stringify({ type: 'root', children: mdast.children.slice(listIndex + 1) });

	return {
		headers: [],
		steps,
		footer,
	};
};

export const getFirstImageIndex = (mdast: Node): number => {
	if (!mdast.children) {
		return -1;
	}
	return mdast.children.findIndex((node) => {
		return (
			isParagraph(node) &&
			node.children?.some((childNode) => {
				return isImage(childNode);
			})
		);
	});
};

/**
 * @summary Extracts leftover readme
 * @function
 * @private
 *
 * @param {String} readme - Readme file
 * @returns {Object}
 *
 * @example
 * getReadmeLeftover(readme,sections)
 */
const getLeftoverReadme = async (readme: string): Promise<string> => {
	const tagline = await getTagline(readme);
	const content = await convertHtmlToMD(readme.replace(tagline, ''));

	const mdast = unified()
		.use(remarkParse, { gfm: true })
		.parse(content) as Node;
	if (!mdast.children) {
		return '';
	}
	let startIndex = null;
	let header: Node | null = null;
	let rest = null;
	let endIndex = null;
	while (startIndex !== -1) {
		startIndex = mdast.children.findIndex((node) => {
			return isHeading(node);
		});

		header = mdast.children[startIndex];
		rest = mdast.children.slice(startIndex + 1);
		// eslint-disable-next-line no-loop-func
		endIndex = rest.findIndex((node) => {
			return isHeading(node) && node.depth === header?.depth;
		});

		if (endIndex === -1) {
			endIndex = rest.length - 1;
		}

		mdast.children.splice(startIndex, endIndex + 1);
	}
	const imageIndex = getFirstImageIndex(mdast);

	if (imageIndex !== -1) {
		mdast.children.splice(imageIndex, 1);
	}

	return unified()
		.use(remarkStringify)
		.stringify(mdast as any);
};

export interface TableOfContentTree {
	title: string;
	id: string;
	depth: number;
	content: string;
}

const slugs = new Slugger();

const getTableOfContent = async (
	content: string,
): Promise<TableOfContentTree[]> => {
	const markdownContent = await convertHtmlToMD(content);
	const mdast = unified()
		.use(remarkParse, { gfm: true })
		.parse(markdownContent) as Node;
	// @ts-expect-error
	const parents = convert((d) => d === mdast);

	slugs.reset();
	// let opening: Node | undefined;
	// let index;
	const map: TableOfContentTree[] = [];
	// let endIndex: Number | undefined;
	// @ts-expect-error
	visit(mdast, 'heading', (node, _position, parent) => {
		const value = toString(node);

		// @ts-expect-error
		const id = node?.data?.hProperties?.id;

		const slug = slugs.slug(id || value);

		if (!parents(parent)) {
			return;
		}

		map.push({
			depth: node.depth as number,
			content: unified()
				.use(remarkStringify)
				.stringify({ children: node.children, type: 'root' }),
			id: slug,
			title: value,
		});
	});
	return map;
};

const extractMetaData = async (markdown: string) => {
	let yamlContent = {};
	const markdownBody: Node[] = [];
	await unified()
		.use(remarkParse)
		.use(remarkStringify)
		.use(remarkFrontmatter, ['yaml'])
		.use(() => (tree: Node) => {
			tree.children?.map((node) => {
				if (node.type === 'yaml') {
					yamlContent = yaml.parse(node.value || '');
				} else {
					markdownBody.push(node);
				}
			});
		})
		.process(markdown);
	return {
		contents: unified()
			.use(remarkStringify)
			.stringify({ type: 'root', children: markdownBody }),
		frontmatter: yamlContent,
	};
};

export type sectionHeadingDepth = 2 | 3;
export interface MarkdownSection {
	title: string;
	content: string;
}

const getSections = async (
	markdown: string,
	headingDepth: sectionHeadingDepth = 2,
): Promise<MarkdownSection[]> => {
	const mdast = markdownAST(await convertHtmlToMD(markdown));
	if (!mdast.children) {
		return [];
	}
	const initialValue: MarkdownSection[] = [];
	let currentTitle: string | null = null;
	let currentNodes: Node[] = [];
	const map: MarkdownSection[] = mdast.children.reduce((list, node, index) => {
		if (currentTitle) {
			if (node.type === `heading` && node.depth === headingDepth) {
				const newList = [
					...list,
					{
						title: currentTitle,
						content: currentNodes.length
							? unified().use(remarkStringify).stringify({
									children: currentNodes,
									type: 'root',
							  })
							: '',
					},
				];
				const value = toString(node as any);
				if (mdast.children && index + 1 === mdast.children.length) {
					return [...newList, { title: value, content: '' }];
				}
				currentTitle = value;
				currentNodes = [];
				return newList;
			}
			currentNodes.push(node);
		}
		if (node.type === `heading` && node.depth === headingDepth) {
			const value = toString(node as any);
			currentTitle = value;
		}
		if (mdast.children && index + 1 === mdast.children.length) {
			if (currentTitle) {
				return [
					...list,
					{
						title: currentTitle,
						content: currentNodes.length
							? unified().use(remarkStringify).stringify({
									children: currentNodes,
									type: 'root',
							  })
							: '',
					},
				];
			}
		}
		return list;
	}, initialValue);
	return map;
};

/**
 * @summary detects if deploy url exists in markdown
 *
 * @param {String} markdown - markdown
 * @param {String} deployUrl - deployUrl
 *
 * @returns {Boolean}
 * @example
 * hasDeployUrl(markdown, deployUrl)
 */
const hasDeployButton = (markdown: string, deployUrl: string): boolean => {
	return markdown.includes(deployUrl);
};

export {
	convertHtmlToMD,
	getMarkdownSection,
	getHighlights,
	getLeftoverSections,
	getInstallationSteps,
	getTagline,
	hasDeployButton,
	getTableOfContent,
	getLeftoverReadme,
	getSections,
	extractMetaData,
};
