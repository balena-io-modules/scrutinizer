/*
 * Copyright 2018 balena
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

'use strict';

const ava = require('ava');
const GitHubBackend = require('../../lib/backends/github');

ava.test(
  'constructor: should parse a GitHub git URL without a protocol',
  test => {
    const backend = new GitHubBackend(
      'git@github.com:balena-io/etcher.git',
      'master'
    );
    test.is(backend.owner, 'balena-io');
    test.is(backend.repo, 'etcher');
  }
);

ava.test(
  'constructor: should parse a GitHub git URL with a git+ssh protocol',
  test => {
    const backend = new GitHubBackend(
      'git+ssh://git@github.com:balena-io/capitano.git',
      'master'
    );
    test.is(backend.owner, 'balena-io');
    test.is(backend.repo, 'capitano');
  }
);

ava.test(
  'constructor: should parse a GitHub HTTPS URL with an extension',
  test => {
    const backend = new GitHubBackend(
      'https://github.com/balena-io/balena-supervisor.git',
      'master'
    );
    test.is(backend.owner, 'balena-io');
    test.is(backend.repo, 'balena-supervisor');
  }
);

ava.test(
  'constructor: should parse a GitHub HTTPS URL without an extension',
  test => {
    const backend = new GitHubBackend(
      'https://github.com/balena-io/balena-supervisor',
      'master'
    );
    test.is(backend.owner, 'balena-io');
    test.is(backend.repo, 'balena-supervisor');
  }
);
