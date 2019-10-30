'use strict';

const _ = require('lodash');
const markdown = require('markdown').markdown;

/**
 * @summary Extract metadta from a markdown file
 * @function
 * @public
 *
 * @param {Object} filename - the markdown filename & content
 * @returns {Object}
 *
 * @example
 * parseMarkdown({ filename: 'ARCHITECTURE.md', contents: '## Architecture' })
 */
const parseMarkdown = ({ filename, contents }) => {
  const rawData = _.tail(markdown.parse(contents));

  return {
    filename,
    mime: 'text/markdown',

    title: _.last(
      _.find(rawData, node => {
        return node[0] === 'header' && node[1].level === 1;
      })
    ),

    data: {
      markdown: contents,
      jsonml: rawData
    }
  };
};

/**
 * @summary Normalize the plugin data to a contract
 * @function
 * @public
 *
 * @param {Object} scrutinizerData - the data as parsed from the plugins
 * @returns {Object}
 *
 * @example
 * normalizeData({active: true, blog: null})
 */
const normalizeData = scrutinizerData => {
  const {
    active,
    architecture,
    blog,
    changelog,
    codeOfConduct,
    contributing,
    contributors,
    description,
    docs,
    examples,
    faq,
    fork,
    hardwareRequired,
    highlights,
    homepage,
    installationSteps,
    introduction,
    isPublic,
    latestPreRelease,
    latestRelease,
    license,
    logo,
    maintainers,
    motivation,
    name,
    owner,
    repositoryUrl,
    screenshot,
    security,
    softwareRequired,
    stars,
    version
  } = scrutinizerData;

  const data = {
    slug: name,
    type: 'repository',
    version,
    markers: [],
    tags: [],
    links: {},
    active,
    data: {
      license,
      name,
      tagline: description,
      images: {
        banner: _.get(logo, ['base64'])
      },
      description,
      version,

      // TODO: Using Detectorist
      type: 'npm',

      links: {
        // TODO: fetch issueTracker
        issueTracker: null,
        homepage,
        repository: repositoryUrl
      },
      maintainers,
      changelog,
      faq,

      // TODO: Parse this in a better manner
      contributing: {
        architecture: architecture
          ? parseMarkdown({
              filename: 'ARCHITECTURE.md',
              contents: architecture
            })
          : null,
        guide: contributing
          ? parseMarkdown({
              filename: 'CONTRIBUTING.md',
              contents: contributing
            })
          : null,
        codeOfConduct: codeOfConduct
          ? parseMarkdown({
              filename: 'CODE_OF_CONDUCT.md',
              contents: codeOfConduct
            })
          : null,
        security: security
          ? parseMarkdown({
              filename: 'SECURITY.md',
              contents: security
            })
          : null
      },
      motivation,
      introduction,
      hardwareRequired,
      softwareRequired,
      highlights,
      screenshot,
      installation: installationSteps,

      // TODO: Parse this in a better manner
      blog: _.map(blog, ({ filename, contents }) => {
        return parseMarkdown({
          filename,
          contents
        });
      }),

      docs: {
        latest: version,
        tags: {
          [version]: _.map(docs, ({ filename, contents }) => {
            return parseMarkdown({
              filename,
              contents
            });
          })
        }
      },

      github: {
        isPublic,
        fork,
        stars,
        owner: {
          handle: owner.handle,
          type: owner.type,
          name: owner.handle,
          url: owner.url,
          avatar: owner.avatar
        },
        usedBy: examples
      },
      contributors,
      releases: {
        latestRelease,
        latestPreRelease
      }
    }
  };

  return data;
};

module.exports = {
  normalizeData
};
