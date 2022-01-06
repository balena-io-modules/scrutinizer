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

import { Octokit } from '@octokit/rest';
import { isArray, map, filter, get, isEmpty, chain } from 'lodash';
import { resolve } from 'bluebird';
import fromNow from 'fromnow';
import debug from 'debug';
import { name as _name } from '../../package.json';
import { imageFileExtensions } from '../utils/image';
import { OctokitOptions } from '@octokit/core/dist-types/types';
import { ResponseHeaders, RequestError } from '@octokit/types';

const debugGithub = debug(`${_name}:backends:github`);
/**
 * @summary Log GitHub rate-limiting information
 * @function
 * @private
 *
 * @param {Object} headers - HTTP headers
 *
 * @example
 * github.repos.getContent({ ... }).then((results) => {
 *   logGitHubRateLimitingInformation(results.meta)
 * })
 */
const logGitHubRateLimitingInformation = (headers: ResponseHeaders) => {
	if (!headers) {
		return;
	}
	if (headers['x-ratelimit-reset']) {
		const resetDate = new Date(
			parseInt(headers['x-ratelimit-reset'], 10) * 1000,
		);
		debugGithub(`Rate limiting: ${headers['x-ratelimit-remaining']}/${
			headers['x-ratelimit-limit']
		},
           will reset in ${fromNow(resetDate)}}`);
	}
};

// interface GithubBackendConstructor {
//   new(repository: string, reference: string): GithubBackendInterface
// }
// interface GithubBackendInterface {
//   init(): void;
//   readDirectoryFilePaths(): void;
// }

export default class GitHubBackend {
	reference: string;
	owner: string;
	repo: string;
	github: Octokit;
	/**
	 * @summary The GitHub based backend
	 * @class
	 * @public
	 *
	 * @param {String} repository - git repository url
	 * @param {String} reference - git repository reference
	 *
	 * @example
	 * const backend = new GitHubBackend('git@github.com:foo/bar.git', 'master')
	 */
	constructor(repository: string, reference: string, context?: any) {
		this.reference = reference;

		const options: OctokitOptions = {
			UserAgent: _name,
		};

		if (process.env.GITHUB_TOKEN) {
			debugGithub('Using $GITHUB_TOKEN as the authentication token');
			options.auth = `token ${process.env.GITHUB_TOKEN}`;
		}
		if (context?.octokit) {
			this.github = context.octokit;
		} else {
			this.github = new Octokit(options);
		}

		const parsedUrl = repository.match(/([\w-]+)\/([\w-]+)(\.\w+)?$/);
		this.owner = parsedUrl![1];
		this.repo = parsedUrl![2];
	}

	/**
	 * @summary Initialize the git repository
	 * @function
	 * @public
	 *
	 * @returns {Promise}
	 *
	 * @example
	 * const backend = new GitHubBackend(...)
	 * backend.init().then(() => {
	 *   console.log('The repository is ready to be used')
	 * })
	 */
	init(): Promise<any> {
		return resolve(this);
	}

	/**
	 * @summary Read the contents of a directort
	 * @function
	 * @public
	 *
	 * @param {String} directory - directory path
	 * @returns {Promise}
	 *
	 * @example
	 * const backend = new GitHubBackend(...)
	 * backend.readDirectoryFilePaths('docs').then((contents) => {
	 *   console.log(contents)
	 * })
	 */
	async readDirectoryFilePaths(directory: string): Promise<any> {
		try {
			const results = await this.github.repos.getContent({
				owner: this.owner,
				repo: this.repo,
				path: directory,
				ref: this.reference,
			});
			logGitHubRateLimitingInformation(results.headers);

			if (isArray(results.data)) {
				const files = map(filter(results.data, { type: 'file' }), 'path');
				return files;
			}

			throw new Error('Not a directory');
		} catch (error: any | RequestError) {
			logGitHubRateLimitingInformation(error.response.headers);
			if (error.status === 404) {
				return null;
			}

			throw error;
		}
	}

	async readOrgFile(file: string): Promise<any> {
		try {
			const results = (await this.github.repos.getContent({
				owner: this.owner,
				repo: this.owner,
				path: file,
			})) as {
				headers: ResponseHeaders;
				data: {
					type: string;
					encoding: BufferEncoding;
					size: number;
					name: string;
					path: string;
					content: string;
					sha: string;
					url: string;
					git_url: string | null;
					html_url: string | null;
					download_url: string | null;
				};
			};

			logGitHubRateLimitingInformation(results.headers);
			if (!(results.data instanceof Array)) {
				if (results.data.type === 'file') {
					const buffer = Buffer.from(
						results.data.content,
						results.data.encoding,
					);

					if (
						results.data.encoding === 'base64' &&
						imageFileExtensions.some((ext) =>
							results.data.name.toLowerCase().endsWith(ext),
						)
					) {
						return buffer.toString('base64');
					}

					return buffer.toString();
				}
			}
			throw new Error(`Can't handle response: ${results.data}`);
		} catch (error: any | RequestError) {
			logGitHubRateLimitingInformation(error.response.headers);
			if (error.status === 404) {
				return null;
			}

			throw error;
		}
	}

	/**
	 * @summary Read the contents of a file
	 * @function
	 * @public
	 *
	 * @param {String} file - file path
	 * @returns {Promise}
	 *
	 * @example
	 * const backend = new GitHubBackend(...)
	 * backend.readFile('README.md').then((contents) => {
	 *   console.log(contents)
	 * })
	 */
	async readFile(file: string, options?: { base64: boolean }): Promise<any> {
		try {
			const results = (await this.github.repos.getContent({
				owner: this.owner,
				repo: this.repo,
				path: file,
				ref: this.reference,
			})) as {
				headers: ResponseHeaders;
				data: {
					type: string;
					encoding: BufferEncoding;
					size: number;
					name: string;
					path: string;
					content: string;
					sha: string;
					url: string;
					git_url: string | null;
					html_url: string | null;
					download_url: string | null;
				};
			};
			logGitHubRateLimitingInformation(results.headers);
			if (!(results.data instanceof Array)) {
				if (results.data.type === 'file') {
					const buffer = Buffer.from(
						results.data.content,
						results.data.encoding,
					);

					if (
						results.data.encoding === 'base64' &&
						imageFileExtensions.some((ext) =>
							results.data.name.toLowerCase().endsWith(ext),
						)
					) {
						return buffer.toString('base64');
					}

					if (options?.base64) {
						return buffer.toString('base64');
					}
					return buffer.toString();
				}
			}
			throw new Error(`Can't handle response: ${results.data}`);
		} catch (error: any | RequestError) {
			logGitHubRateLimitingInformation(error.response.headers);
			if (error.status === 404) {
				return null;
			}

			if (
				error.status === 403 &&
				error.message.includes(
					'The requested blob is too large to fetch via the API',
				)
			) {
				return null;
			}

			throw error;
		}
	}

	/**
	 * @summary Get the basic Github metadata
	 * @function
	 * @public
	 *
	 * @returns {Promise}
	 *
	 * @example
	 * const backend = new FileSystemBackend(...)
	 * backend.getMetadata().then((metadata) => {
	 *   console.log(metadata)
	 * })
	 */
	async getMetadata(): Promise<any> {
		const results = await this.github.repos.get({
			owner: this.owner,
			repo: this.repo,
		});
		logGitHubRateLimitingInformation(results.headers);
		return {
			name: results.data.name,
			public: !results.data.private,
			fork: results.data.fork,
			description: results.data.description,
			stars: results.data.stargazers_count,
			homepage: results.data.homepage,
			repositoryUrl: results.data.clone_url,
			active: !results.data.archived && !results.data.disabled,
			owner: {
				avatar: results.data.owner?.avatar_url,
				handle: results.data.owner?.login,
				url: results.data.owner?.html_url,
				type: results.data.owner?.type,
			},
		};
	}

	/**
	 * @summary Get the repository URL
	 * @function
	 * @public
	 *
	 * @returns {Promise}
	 *
	 * @example
	 * const backend = new GitHubBackend(...)
	 * backend.getRepositoryUrl().then((url) => {
	 *   console.log(url)
	 * })
	 */
	async getRepositoryUrl(): Promise<any> {
		const results = await this.getMetadata();
		if (!results) {
			return null;
		}
		return results.repositoryUrl;
	}

	/**
	 * @summary Get the date of the last commit
	 * @function
	 * @public
	 *
	 * @returns {Promise}
	 *
	 * @example
	 * const backend = new GitHubBackend(...)
	 * backend.getLastCommitDate().then((lastCommitDate) => {
	 *   console.log(lastCommitDate)
	 * })
	 */
	async getLastCommitDate(): Promise<any> {
		try {
			const results = await this.github.repos.listCommits({
				owner: this.owner,
				repo: this.repo,
				sha: this.reference,
				per_page: 1,
				page: 1,
			});
			logGitHubRateLimitingInformation(results.headers);
			const commitDate = get(
				results,
				['data', '0', 'commit', 'committer', 'date'],
				null,
			);
			return commitDate;
		} catch (error: any | RequestError) {
			if (error.status === 404) {
				debugGithub(
					'Cannot get the last commit (have you passed $GITHUB_TOKEN ?)',
				);
				return null;
			}

			throw error;
		}
	}

	/**
	 * @summary Get the contriburors
	 * @function
	 * @public
	 *
	 * @returns {Promise}
	 *
	 * @example
	 * const backend = new GitHubBackend(...)
	 * backend.this().then((list) => {
	 *   console.log(list)
	 * })
	 */
	async getContributors(): Promise<any> {
		try {
			const results = await this.github.repos.listContributors({
				owner: this.owner,
				repo: this.repo,
			});
			logGitHubRateLimitingInformation(results.headers);
			const contributors = get(results, ['data'], []);
			return map(contributors, ({ login, avatar_url, contributions }) => {
				return {
					username: login,
					avatar: avatar_url,
					contributions,
				};
			});
		} catch (error: any | RequestError) {
			if (error.status === 404) {
				debugGithub(
					'Cannot get the contributors list (have you passed $GITHUB_TOKEN ?)',
				);
				return null;
			}

			throw error;
		}
	}

	/**
	 * @summary Get the latest release
	 * @function
	 * @public
	 *
	 * @returns {Promise}
	 *
	 * @example
	 * const backend = new GitHubBackend(...)
	 * backend.getReleases().then((releases) => {
	 *   console.log(releases)
	 * })
	 */
	async getLatestRelease(): Promise<any> {
		try {
			const results = await this.github.repos.getLatestRelease({
				owner: this.owner,
				repo: this.repo,
			});
			logGitHubRateLimitingInformation(results.headers);
			const releaseAssets = map(results.data.assets, (asset) => {
				return {
					name: asset.name,
					downloadUrl: asset.browser_download_url,
				};
			});

			if (isEmpty(results.data)) {
				return null;
			}
			return {
				tagName: results.data.tag_name,
				asssets: releaseAssets,
			};
		} catch (error: any | RequestError) {
			if (error.status === 404) {
				debugGithub(
					'Cannot get the latest release (have you passed $GITHUB_TOKEN ?)',
				);
				return null;
			}

			throw error;
		}
	}

	/**
	 * @summary Get the latest prerelease
	 * @function
	 * @public
	 *
	 * @returns {Promise}
	 *
	 * @example
	 * const backend = new GitHubBackend(...)
	 * backend.getPreReleases().then((releases) => {
	 *   console.log(releases)
	 * })
	 */
	async getLatestPreRelease(): Promise<any> {
		try {
			const results = await this.github.paginate(
				'GET /repos/:owner/:repo/releases',
				{
					owner: this.owner,
					repo: this.repo,
				},
			);
			if (isEmpty(results)) {
				return null;
			}

			const candidate = chain(results)
				.filter('prerelease')
				.sortBy('created_at')
				.last()
				.value() as {
				tag_name: string;
				assets: [{ name: string; browser_download_url: string }];
			};

			if (!candidate) {
				return null;
			}
			return {
				tagName: candidate.tag_name,
				assets: map(candidate.assets, (asset) => {
					return {
						name: asset.name,
						downloadUrl: asset.browser_download_url,
					};
				}),
			};
		} catch (error: any | RequestError) {
			if (error.status === 404) {
				debugGithub(
					'Cannot get the latest release (have you passed $GITHUB_TOKEN ?)',
				);
				return null;
			}

			throw error;
		}
	}

	/**
	 * @summary Get the # of the open issues, along with the 20 latest ones
	 * @function
	 * @public
	 *
	 * @returns {Promise}
	 *
	 * @example
	 * const backend = new GitHubBackend(...)
	 * backend.getOpenIssues().then((openIssues) => {
	 *   console.log(openIssues)
	 * })
	 */
	async getOpenIssues(): Promise<any> {
		const results = await this.github.repos.get({
			owner: this.owner,
			repo: this.repo,
		});
		logGitHubRateLimitingInformation(results.headers);
		const numberOfIssues = results.data.open_issues_count;
		const openIssuesObj: {
			numberOfIssues: number;
			latestIssues: Array<{ title: string; url: string }>;
		} = {
			numberOfIssues,
			latestIssues: [],
		};
		if (numberOfIssues === 0) {
			return openIssuesObj;
		}
		const issueResults = await this.github.issues.listForRepo({
			owner: this.owner,
			repo: this.repo,
			state: 'open',
			per_page: 20,
			page: 1,
		});
		logGitHubRateLimitingInformation(issueResults.headers);
		const latestIssues = map(issueResults.data, (issue) => {
			return {
				title: issue.title,
				url: issue.html_url,
			};
		});
		openIssuesObj.latestIssues = latestIssues;
		return openIssuesObj;
	}

	async getZipballArchiveUrl(): Promise<string> {
		const result = (await this.github.rest.repos.downloadZipballArchive({
			owner: this.owner,
			repo: this.repo,
			ref: this.reference,
		})) as { data: string };

		return result.data;
	}
}
