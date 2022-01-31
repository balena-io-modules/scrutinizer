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

import { get } from 'lodash';
import { resolve } from 'bluebird';
import fs from 'fs';
import { join } from 'path';
import GitHubBackend from './github';
import { imageFileExtensions } from '../utils/image';

export default class FileSystemBackend {
	repository: string;
	reference: string;
	repositoryUrl: string;
	github: GitHubBackend;
	/**
	 * @summary The file-system based backend
	 * @class
	 * @public
	 *
	 * @param {String} repository - git repository path
	 * @param {String} reference - git repository reference
	 *
	 * @example
	 * const backend = new FileSystemBackend('foo/bar', 'master')
	 */
	constructor(
		repository: string,
		reference: string,
		context?: any,
		repositoryUrl?: string,
	) {
		this.repository = repository;
		this.reference = reference;

		if (repositoryUrl) {
			this.repositoryUrl = repositoryUrl;
		}
		if (context) {
			this.github = new GitHubBackend(
				this.repositoryUrl,
				this.reference,
				context,
			);
		}
	}

	/**
	 * @summary Initialize the git repository
	 * @function
	 * @public
	 *
	 * @returns {Promise}
	 *
	 * @example
	 * const backend = new FileSystemBackend(...)
	 * backend.init().then(() => {
	 *   console.log('The repository is ready to be used')
	 * })
	 */
	async init(): Promise<any> {
		const url = await this.getRepositoryUrl();
		if (!url) {
			return resolve();
		}
		if (this.github) {
			return this.github.init();
		}
		this.github = new GitHubBackend(url, this.reference);
		return this.github.init();
	}

	/**
	 * @summary Get the repository URL
	 * @function
	 * @private
	 *
	 * @returns {Promise}
	 *
	 * @example
	 * const backend = new FileSystemBackend(...)
	 * backend.getRepositoryUrl().then((url) => {
	 *   console.log(url)
	 * })
	 */
	async getRepositoryUrl(): Promise<any> {
		if (this.repositoryUrl) {
			return resolve(this.repositoryUrl);
		}
		const content = await this.readFile('package.json');
		if (!content) {
			if (this.github) {
				return this.github.getRepositoryUrl();
			}
			return resolve(null);
		}
		return get(
			JSON.parse(content),
			['repository', 'url'],
			this.github ? this.github.getRepositoryUrl() : null,
		);
	}

	/**
	 * @summary Read the contents of a directory
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
		if (!this.github) {
			return resolve(null);
		}
		return this.github.readDirectoryFilePaths(directory);
	}

	async readOrgFile(file: string): Promise<any> {
		if (!this.github) {
			return resolve(null);
		}
		return this.github.readOrgFile(file);
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
	 * const backend = new FileSystemBackend(...)
	 * backend.readFile('README.md').then((contents) => {
	 *   console.log(contents)
	 * })
	 */
	async readFile(file: string, _options?: { base64: boolean }): Promise<any> {
		try {
			const fileContent = await fs.promises.readFile(
				join(this.repository, file),
				{
					encoding: imageFileExtensions.includes(
						file.split('.').reverse()[0]?.toLowerCase(),
					)
						? 'base64'
						: 'utf8',
				},
			);
			return fileContent;
		} catch (e) {
			return null;
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
	getMetadata(): Promise<any> {
		if (!this.github) {
			return resolve(null);
		}

		return this.github.getMetadata();
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
	getLastCommitDate(): Promise<any> {
		if (!this.github) {
			return resolve(null);
		}

		return this.github.getLastCommitDate();
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
	getContributors(): Promise<any> {
		if (!this.github) {
			return resolve(null);
		}

		return this.github.getContributors();
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
	getLatestRelease(): Promise<any> {
		if (!this.github) {
			return resolve(null);
		}

		return this.github.getLatestRelease();
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
	 * backend.getReleases().then((releases) => {
	 *   console.log(releases)
	 * })
	 */
	getLatestPreRelease(): Promise<any> {
		if (!this.github) {
			return resolve(null);
		}

		return this.github.getLatestPreRelease();
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
	getOpenIssues(): Promise<any> {
		if (!this.github) {
			return resolve(null);
		}

		return this.github.getOpenIssues();
	}

	getZipballArchiveUrl(): Promise<any> {
		if (!this.github) {
			return resolve(null);
		}

		return this.github.getZipballArchiveUrl();
	}
}
