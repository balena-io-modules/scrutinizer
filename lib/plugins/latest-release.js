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
const { getArch, getOS, getInstallerType } = require('../utils/releases');

const EXTENSIONS_TO_EXCLUDE = [
  '.blockmap',
  '.yaml',
  '.yml',
  '.txt',
  'SHASUMS256',
  'AppImage',
  '.deb',
  'rpm',
];

module.exports = backend => {
  return backend.getLatestRelease().then(latestRelease => {
    let assets = _.get(latestRelease, ['assets']);

    if (_.isEmpty(assets)) {
      return { latestRelease: null };
    }

    // Filter out irrelevant assets
    assets = assets.filter(asset => {
      return !_.some(EXTENSIONS_TO_EXCLUDE, extension => {
        return _.endsWith(asset.name, extension);
      });
    });

    assets = assets.map(asset => {
      const str = asset.name.toLowerCase();
      return {
        ...asset,
        os: getOS(str),
        arch: getArch(str),
        installerType: getInstallerType(str),
      };
    });

    latestRelease.assets = assets;

    return {
      latestRelease,
    };
  });
};
