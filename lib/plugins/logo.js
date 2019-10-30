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
const { markdown } = require('markdown');
const { convertRemoteImageToBase64 } = require('../utils/image');

module.exports = backend => {
  return Bluebird.props({
    readme: backend.readFile('README.md'),
  }).then(files => {
    const tree = markdown.parse(files.readme);

    if (!_.isEmpty(tree)) {
      // Get the first element
      let markdownElement = tree[1];

      if (_.has(markdownElement, ['references'])) {
        markdownElement = tree[2];
      }

      // The image might be under a path like: p -> a -> img
      while (
        _.isArray(markdownElement) &&
        !_.isEmpty(markdownElement) &&
        _.head(markdownElement) !== 'img'
      ) {
        /* The structure of the element will be an array with
         1. Element type as string (e.g. 'header')
         2. Any properties (e.g. level: 2)
         3. The next nested child element.

         We'll be parsing through all the child elements,
         until there is an image or no more elements to parse
         */
        markdownElement = _.last(markdownElement);
      }

      // If the last element is an image, get the href attribue which will be
      // inside an object, in the second item of the array (see above)
      const imageUrl = _.get(markdownElement, [[1], 'href'], null);

      if (imageUrl) {
        return convertRemoteImageToBase64(imageUrl).then(imageAsBase64 => {
          return {
            logo: {
              url: imageUrl,
              base64: imageAsBase64,
            },
          };
        });
      }

      return {
        logo: null,
      };
    }

    return {
      logo: null,
    };
  });
};
