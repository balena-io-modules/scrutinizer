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

/**
 * @module scrutinizer
 */

import { merge, constant, isEmpty, pick, values } from 'lodash';
import { name } from '../package.json';
import git from 'simple-git/promise';
import { promisify, reduce } from 'bluebird';
import debug from 'debug';
import { setGracefulCleanup, dir } from 'tmp';
import { promisify as multiArgPromisify } from 'util';
import stream from 'stream';
import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';

import { Backend } from '../typings/types';
import GitHubBackend from './backends/github';
import FileSystemBackend from './backends/fs';
import license from './plugins/license';
import blog from './plugins/blog';
import changelog from './plugins/changelog';
import contributing from './plugins/contributing';
import contributors from './plugins/contributors';
import docs from './plugins/docs';
import security from './plugins/security';
import faq from './plugins/faq';
import codeOfConduct from './plugins/code-of-conduct';
import architecture from './plugins/architecture';
import maintainers from './plugins/maintainers';
import readme from './plugins/readme';
import readmeSections from './plugins/readme-sections';
import githubMetadata from './plugins/github-metadata';
import dependencies from './plugins/dependencies';
import lastCommitDate from './plugins/last-commit-date';
import latestRelease from './plugins/latest-release';
import latestPreRelease from './plugins/latest-prerelease';
import openIssues from './plugins/open-issues';
import version from './plugins/version';
import deployButtons from './plugins/deployButtons';
import screenshot from './plugins/screenshot';
import logo from './plugins/logo';
import logoBrandmark from './plugins/logo-brandmark';
import balena from './plugins/balena';
import orgLogos from './plugins/org-logos';
import netlifyConfig from './plugins/netlify';
import contract from './plugins/contract';
import orgContract from './plugins/org-contract';

const debugLog = debug(`${name}`);
const dirAsync = promisify(dir);
setGracefulCleanup();

type BackendClasses = typeof GitHubBackend | typeof FileSystemBackend;
/**
 * @summary Supported backends
 * @type {Object}
 * @constant
 * @private
 */
const BACKENDS: { [key: string]: BackendClasses } = {
	fs: FileSystemBackend,
	github: GitHubBackend,
};

type Plugins = {
	[key: string]: (backend: Backend) => any;
};

const BUILTIN_PLUGINS: Plugins = {
	license,
	blog,
	changelog,
	contributing,
	contributors,
	docs,
	security,
	faq,
	'code-of-conduct': codeOfConduct,
	architecture,
	maintainers,
	readme,
	'readme-sections': readmeSections,
	'github-metadata': githubMetadata,
	dependencies,
	'last-commit-date': lastCommitDate,
	'latest-release': latestRelease,
	'latest-prerelease': latestPreRelease,
	'open-issues': openIssues,
	version,
	deployButtons,
	screenshot,
	logo,
	logoBrandMark: logoBrandmark,
	balena,
	'org-logos': orgLogos,
	netlifyConfig,
	contract,
	'org-contract': orgContract,
};

type valueOf<T> = T[keyof T];

interface ExamineGitRepoOptions {
	repository: string;
	backend: BackendClasses;
	plugins: Array<valueOf<Plugins>>;
	accumulator: object;
	reference: string;
	progress?: (progress: { percentage: number }) => void;
	context?: any;
	repositoryUrl?: string;
}

/**
 * @summary Examine a git repository
 * @function
 * @private
 *
 * @param {Object} options - options
 * @param {String} options.repository - repository URL (can be local)
 * @param {Object} options.backend - scrutinizer backend to interact with the repository
 * @param {Function[]} options.plugins - plugins to use during examination
 * @param {Object} options.accumulator - default accumulator
 * @param {String} options.reference - git reference to check
 * @param {Function} [options.progress] - progress function callback
 * @returns {Promise}
 *
 * @example
 * examineGitRepository({
 *   repository: 'foo/bar/baz',
 *   backend: BACKENDS.fs,
 *   plugins: BUILTIN_PLUGINS,
 *   accumulator: {},
 *   reference: 'master',
 *   progress: (state) => {
 *     console.log(state)
 *   }
 * }).then((results) => {
 *   console.log(results)
 * })
 */
const examineGitRepository = (options: ExamineGitRepoOptions): Promise<any> => {
	return reduce(
		options.plugins,
		(accumulator, plugin, index) => {
			if (options.progress) {
				options.progress({
					percentage: Math.floor((index * 100) / options.plugins.length),
				});
			}

			// eslint-disable-next-line new-cap
			const backend = new options.backend(
				options.repository,
				options.reference,
				options.context,
				options.repositoryUrl,
			);
			return backend.init().then(() => {
				return plugin(backend).then((result: object) => {
					return merge(accumulator, result);
				});
			});
		},
		options.accumulator,
	);
};

const pipeline = multiArgPromisify(stream.pipeline);

export const utils = {
	getRepoZipballUrl: async (repo: string, reference: string, context?: any) => {
		const url = await new GitHubBackend(
			repo,
			reference,
			context,
		).getZipballArchiveUrl();
		return url;
	},
};

/**
 * @summary Examine a local git repository directory
 * @function
 * @public
 *
 * @param {String} gitRepository - path to git repository
 * @param {Object} options - options
 * @param {String} options.reference - git reference to check
 * @param {Function} [options.progress] - progress callback (state)
 * @param {String[]} [options.whitelistPlugins] - list of plugins to run. Matches all if empty
 * @fulfil {Object} - examination results
 * @returns {Promise}
 *
 * @example
 * scrutinizer.local('./foo/bar/baz', {
 *   reference: 'master',
 *   progress: (state) => {
 *     console.log(state.percentage)
 *   }
 * }).then((results) => {
 *   console.log(results)
 * })
 */
export async function local(
	gitRepository: string,
	options: {
		reference: string;
		progress?: (state: { percentage: number }) => void;
		whitelistPlugins: string[];
		context?: any;
		downloadRepo?: boolean;
	},
) {
	let temporaryDirectory;
	try {
		// @ts-expect-error
		temporaryDirectory = await dirAsync({
			// This ensures the temporary directory is removed
			// when this module finishes its job even if the
			// directory is not empty
			unsafeCleanup: true,
			prefix: `${name}_`,
		});
	} catch (error) {
		debugLog(error);
	}
	let temporaryRepository;
	let repoUrl;

	// Clone the local repository into a temporary
	// directory, so we can reset it, modify it, and
	// traverse it as much as we want without messing
	// up with the user's original repo, or with the
	// user's unstaged changes, etc.
	if (options.downloadRepo && temporaryDirectory) {
		repoUrl = gitRepository;
		const repoZipUrl = await utils.getRepoZipballUrl(
			gitRepository,
			options.reference,
			options.context,
		);

		await fs.promises.mkdir(temporaryDirectory, {
			recursive: true,
		});
		const repoZipPath = path.resolve(temporaryDirectory, 'repo.zip');
		const repoPath = path.resolve(temporaryDirectory, 'repo');
		await fs.promises.mkdir(repoPath, {
			recursive: true,
		});

		await fs.promises.writeFile(
			repoZipPath,
			Buffer.from(repoZipUrl.data as Uint8Array),
		);

		await pipeline(
			fs.createReadStream(repoZipPath),
			unzipper.Extract({
				path: repoPath,
			}),
		);
		const folderName = (repoZipUrl['headers']['content-disposition'] as string)
			?.split('=')[1]
			?.replace('.zip', '');
		temporaryRepository = path.join(temporaryDirectory, folderName);
	} else {
		debugLog(`Cloning ${gitRepository} to ${temporaryDirectory}`);
		const repoRemotes = await git(gitRepository).remote(['-v']);
		let repoUrls = repoRemotes
			?.split('\n')
			.filter((repoRemote) => repoRemote.includes('(fetch)'))
			.map((line) => {
				return line.split('\t')[1];
			});
		repoUrls = repoUrls
			?.filter((url) => {
				return !!url;
			})
			.map((url) => {
				return url.replace(
					/^(?:https:\/\/|git@|git:\/\/|git:\/\/)?(.*?):(.*?)\.git(.*?)$/,
					'https://$1/$2',
				);
			});

		repoUrl = repoUrls?.[0];

		temporaryRepository = await git()
			.clone(gitRepository, temporaryDirectory as string)
			.then(constant(temporaryDirectory));
	}

	return await examineGitRepository({
		repository: temporaryRepository as string,
		backend: BACKENDS.fs,
		plugins: filterPlugins(options.whitelistPlugins),
		accumulator: {},
		progress: options.progress,
		reference: options.reference,
		context: options.context,
		repositoryUrl: repoUrl,
	});
}

/**
 * @summary Examine a remote git repository url
 * @function
 * @public
 *
 * @description
 * If `$GITHUB_TOKEN` is set, it will be used to authenticate with
 * GitHub to increase rate-limiting.
 *
 * @param {String} gitRepository - git repository url
 * @param {Object} options - options
 * @param {String} options.reference - git reference to check
 * @param {Function} [options.progress] - progress callback (state)
 * @param {String[]} [options.whitelistPlugins] - list of plugins to run. Matches all if empty
 * @fulfil {Object} - examination results
 * @returns {Promise}
 *
 * @example
 * scrutinizer.remote('git@github.com:foo/bar.git', {
 *   reference: 'master',
 *   progress: (state) => {
 *     console.log(state.percentage)
 *   }
 * }).then((results) => {
 *   console.log(results)
 * })
 */
export function remote(
	gitRepository: string,
	options: {
		reference: string;
		progress?: (state: { percentage: number }) => void;
		whitelistPlugins: string[];
		context?: any;
	},
) {
	return examineGitRepository({
		repository: gitRepository,
		backend: BACKENDS.github,
		plugins: filterPlugins(options.whitelistPlugins),
		accumulator: {},
		progress: options.progress,
		reference: options.reference,
		context: options.context,
	});
}

/**
 * @summary Filter whitelist from BUILTIN_PLUGINS
 * @function
 * @private
 *
 * @description
 * Filter BUILTIN_PLUGINS based on a whitelist
 *
 * @param {String[]} pluginWhitelist - list of plugins to whitelist
 * @returns {Function[]}
 *
 * @example
 * filterPlugins(['docs'])
 */
const filterPlugins = (pluginWhitelist: string[]): Array<valueOf<Plugins>> => {
	let plugins: Plugins = BUILTIN_PLUGINS;
	if (!isEmpty(pluginWhitelist)) {
		plugins = pick(plugins, pluginWhitelist);
	}
	return values(plugins);
};
