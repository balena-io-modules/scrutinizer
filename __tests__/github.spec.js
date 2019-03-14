/*
 * Copyright 2018 balena.io
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

'use strict'

const GitHubBackend = require('../lib/backends/github')

describe('Initializing client', () => {
  test('constructor: should parse a GitHub git URL without a protocol', () => {
    const backend = new GitHubBackend(
      'git@github.com:balena-io/etcher.git',
      'master'
    )
    expect(backend.owner).toBe('balena-io')
    expect(backend.repo).toBe('etcher')
  })

  test('constructor: should parse a GitHub git URL with a git+ssh protocol', () => {
    const backend = new GitHubBackend(
      'git+ssh://git@github.com:balena-io/capitano.git',
      'master'
    )
    expect(backend.owner).toBe('balena-io')
    expect(backend.repo).toBe('capitano')
  })

  test('constructor: should parse a GitHub HTTPS URL with an extension', () => {
    const backend = new GitHubBackend(
      'https://github.com/balena-io/balena-supervisor.git',
      'master'
    )
    expect(backend.owner).toBe('balena-io')
    expect(backend.repo).toBe('balena-supervisor')
  })

  test('constructor: should parse a GitHub HTTPS URL without an extension', () => {
    const backend = new GitHubBackend(
      'https://github.com/balena-io/balena-supervisor',
      'master'
    )
    expect(backend.owner).toBe('balena-io')
    expect(backend.repo).toBe('balena-supervisor')
  })
})
