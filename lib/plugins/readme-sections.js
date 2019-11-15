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

const Bluebird = require('bluebird');
const _ = require('lodash');
const markdown = require('markdown').markdown;
const { getScreenshot } = require('../utils/image');

/**
 * @summary Get section from Readme
 * @function
 * @private
 *
 * @param {String} readme - Readme file
 * @param {String} section - Section name
 * @returns {Object}
 *
 * @example
 * getReadmeSection(readme, section)
 */
const getReadmeSection = (readme, section) => {
  const tree = _.tail(markdown.parse(readme));
  const startIndex = _.findIndex(tree, node => {
    return _.first(node) === 'header' && _.last(node) === section;
  });

  if (startIndex === -1) {
    return null;
  }

  const header = tree[startIndex];
  const rest = tree.slice(startIndex + 1);
  const endIndex = _.findIndex(rest, node => {
    return _.first(node) === 'header' && node[1].level === header[1].level;
  });

  const content = rest.slice(0, endIndex);

  return content;
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
const getHighlights = readme => {
  const content = getReadmeSection(readme, 'Highlights');

  const listIndex = _.findIndex(content, node => {
    return node[0] === 'bulletlist';
  });

  if (listIndex === -1) {
    return null;
  }

  return _.map(_.tail(content[listIndex]), highlight => {
    // Removes the `bulletlist` modifier
    const entry = highlight.slice(1);

    // Get only the text, without the modifier (e.g. strong)
    const title = entry[0][1];

    // Get the whole JsonML entry, including links, text highlights, etc
    const description = _.tail(entry);

    // Remove the leftover delimiter
    description[0] = description[0].replace(': ', '');

    return {
      title,
      description,
    };
  });
};

/**
 * @summary Get installation steps from Readme
 * @function
 * @private
 *
 * @param {String} readme - Readme file
 * @returns {Object}
 *
 * @example
 * getInstallationSteps(readme)
 */
const getInstallationSteps = readme => {
  const content = getReadmeSection(readme, 'Installation');

  const listIndex = _.findIndex(content, node => {
    return node[0] === 'numberlist';
  });

  if (listIndex === -1) {
    return null;
  }

  return {
    headers: [],
    steps: _.map(_.tail(content[listIndex]), node => {
      return _.tail(node);
    }),
    footer: content.slice(listIndex + 1),
  };
};

/**
 * @summary Get sites using the project from Readme
 * @function
 * @private
 *
 * @param {String} readme - Readme file
 * @returns {Object}
 *
 * @example
 * getExamples(readme)
 */
const getExamples = async readme => {
  const content = getReadmeSection(readme, 'Examples');

  const listIndex = _.findIndex(content, node => {
    return node[0] === 'bulletlist';
  });

  if (listIndex === -1) {
    return null;
  }

  const examples = await Bluebird.map(
    _.tail(content[listIndex]),
    async highlight => {
      const websiteUrl = highlight.slice(1)[0][1].href;

      return {
        name: _.last(highlight.slice(1)[0]),
        website: websiteUrl,
        description: highlight.slice(1)[1].replace(' - ', ''),
        screenshot: await getScreenshot(websiteUrl),
      };
    }
  );

  return examples;
};

module.exports = async backend => {
  const { readme } = await Bluebird.props({
    readme: backend.readFile('README.md'),
  });

  if (!readme) {
    return {
      highlights: null,
      installationSteps: null,
      examples: null,
      motivation: null,
      hardwareRequired: null,
      softwareRequired: null,
      introduction: null,
    };
  }

  return {
    highlights: getHighlights(readme),
    installationSteps: getInstallationSteps(readme),
    examples: await getExamples(readme),
    motivation: getReadmeSection(readme, 'Motivation'),
    hardwareRequired: getReadmeSection(readme, 'Hardware required'),
    softwareRequired: getReadmeSection(readme, 'Software required'),
    introduction: getReadmeSection(readme, 'Introduction'),
  };
};
