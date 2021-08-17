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
import GitHubBackend from '../../lib/backends/github';

ava('constructor: should parse a GitHub git URL without a protocol', (t) => {
	const backend = new GitHubBackend(
		'git@github.com:resin-io/etcher.git',
		'master',
	);
	t.is(backend.owner, 'resin-io');
	t.is(backend.repo, 'etcher');
});

ava(
	'constructor: should parse a GitHub git URL with a git+ssh protocol',
	(t) => {
		const backend = new GitHubBackend(
			'git+ssh://git@github.com:resin-io/capitano.git',
			'master',
		);
		t.is(backend.owner, 'resin-io');
		t.is(backend.repo, 'capitano');
	},
);

ava('constructor: should parse a GitHub HTTPS URL with an extension', (t) => {
	const backend = new GitHubBackend(
		'https://github.com/resin-io/resin-supervisor.git',
		'master',
	);
	t.is(backend.owner, 'resin-io');
	t.is(backend.repo, 'resin-supervisor');
});

ava(
	'constructor: should parse a GitHub HTTPS URL without an extension',
	(t) => {
		const backend = new GitHubBackend(
			'https://github.com/resin-io/resin-supervisor',
			'master',
		);
		t.is(backend.owner, 'resin-io');
		t.is(backend.repo, 'resin-supervisor');
	},
);
