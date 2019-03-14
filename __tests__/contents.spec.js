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

'use strict';

const _ = require('lodash');
const path = require('path');
const scrutinizer = require('../lib');

const testCase = require(path.join(__dirname, 'e2e', 'etcher'));
const repositoryPath = path.join(__dirname, 'repositories', 'etcher');

const commonTests = data => {
  // Basic Structure
  expect(data)
    .toHaveProperty('architecture')
    .toHaveProperty('dependencies', expect.any(Array))
    .toHaveProperty('contributing')
    .toHaveProperty('lastCommitDate')
    .toHaveProperty('license', expect.any(String))
    .toHaveProperty('public', expect.any(Boolean));

  // Verify that the date string, is indeed of Date type
  expect(_.isDate(new Date(data.lastCommitDate))).toBe(true);
};

describe('Testing the repo contents', () => {
  test(`remote: ${testCase.name} (${testCase.reference})`, async () => {
    const data = await scrutinizer.remote(testCase.url, {
      reference: testCase.reference,
    });
    commonTests(data);
  }, 30000);

  test(`local: ${testCase.name} (${testCase.reference})`, async () => {
    const data = await scrutinizer.local(repositoryPath, {
      reference: testCase.reference,
    });
    commonTests(data);
  }, 30000);
});
