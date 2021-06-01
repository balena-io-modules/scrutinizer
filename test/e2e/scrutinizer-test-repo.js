'use strict'

/* eslint-disable max-len */

const readmeLeftover = `
`

const docsContent = `# [](#getting-started)Getting Started

Welcome to Landr! Setting up Landr in your project is extremely easy. First, make sure you install the \`landr\` CLI from npmjs.org if you haven't already by running:

\`\`\`sh
npm install --global landr
\`\`\`

Lets also install the excellent [\`serve\`](https://www.npmjs.com/package/serve) static HTTP server as a way to preview our site:

\`\`\`sh
npm install --global serve
\`\`\`

Now that everything is in place, head over to your project's repository and run:

\`\`\`sh
landr build
\`\`\`

Give it a bunch of seconds, and you should get various HTML, CSS, and JavaScript files in the \`dist\` directory. You can preview your site by running:

\`\`\`sh
serve dist
\`\`\`

And pointing your browser to \`localhost:5000\`.

At this point, you have working, but not perfect, website. Landr generates websites based on the content of the repository and relies on various OSS conventions for doing its job. Making sure your repository is well structured and follows the community conventions will do wonders for you website, and for your repository overall!

Once you are happy with your site, run the following command to deploy to Netlify:

    NETLIFY_AUTH_TOKEN=<token> landr deploy

Passing your Netlify authentication token as an environment variable.

Version 2
`

const docsDummyContent = `# [](#dummy)Dummy

Test
`

const contributing = `This is a placeholder file.

We strongly urge you to checkout [Scrutinizer](https://github.com/balena-io-modules/scrutinizer) instead.
`

const blogContent = `# Dummy article

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec nisi ligula. Cras orci nulla, venenatis vel tincidunt sed, tristique eget lorem. Pellentesque sit amet blandit elit, in tincidunt augue. Proin hendrerit dolor purus, a tincidunt eros porttitor sed. Integer libero nibh, auctor id eros fermentum, dignissim maximus tellus. In nulla ligula, dapibus sed nisi et, fringilla imperdiet justo. Sed volutpat ligula non sapien ornare tempus. Vivamus tincidunt dapibus placerat. Vestibulum eu sem lorem. Maecenas massa lacus, tempus vitae tempus quis, laoreet at leo. Vivamus placerat vestibulum diam, ac gravida lectus pretium at. Nullam gravida justo libero, sed ornare nulla cursus et. Curabitur ac neque sit amet lacus congue consectetur. Etiam varius facilisis lacus, sed bibendum libero interdum id. Pellentesque vitae pharetra massa. Cras ut sapien id turpis semper commodo.

In non suscipit mi, non finibus nunc. Vivamus vehicula venenatis sapien, vitae dictum elit maximus non. Quisque bibendum facilisis nibh, at bibendum turpis porta vel. Curabitur finibus faucibus orci id rutrum. Nulla et dictum neque. Aenean suscipit mattis tempus. Ut id risus tristique, semper turpis sed, hendrerit neque. Vivamus tellus metus, pellentesque at sapien non, vulputate aliquet elit. Donec sodales ligula augue. Duis fermentum libero massa, quis egestas nibh pellentesque eget. Ut at consequat urna. Sed non diam dapibus, rutrum neque ac, pretium nulla. Proin finibus pulvinar varius. Vestibulum eget tincidunt lorem.

Version 2
`

const readme = `scrutinizer-test-repo
===========

This repository serves as a playground for [Scrutinizer](https://github.com/balena-io-modules/scrutinizer).

Scrutinizer's test suite relies on various metadata including 'Integrations' and more. These properties can change at any time in an active project. Consequently, this repository will serve as a predictable point of reference for our tests.
`
const leftoverSections = [
  {
    title: `# [](#scrutinizer-test-repo)scrutinizer-test-repo
`,
    description: `This repository serves as a playground for [Scrutinizer](https://github.com/balena-io-modules/scrutinizer).

Scrutinizer's test suite relies on various metadata including 'Integrations' and more. These properties can change at any time in an active project. Consequently, this repository will serve as a predictable point of reference for our tests.
`
  }
]
/* eslint-enable */

const data = {
  name: 'scrutinizer-test-repo',
  url: 'git@github.com:balena-io-modules/scrutinizer-test-repo',
  reference: 'e789054c637c957fb837691f81e5227faa5ebd82',
  plugins: [],
  result: {
    name: 'scrutinizer-test-repo',
    version: '1.5.0',
    logo: null,
    logoBrandMark: null,
    description: 'A dummy repository to run scrutinizer\'s test suite against',
    public: true,
    fork: false,
    stars: 0,
    homepage: null,
    repositoryUrl:
      'https://github.com/balena-io-modules/scrutinizer-test-repo.git',
    active: true,
    license: 'Apache-2.0',
    contributing,
    architecture: null,
    security: null,
    lastCommitDate: '2019-09-17T13:42:54Z',
    latestRelease: null,
    latestPreRelease: null,
    deployWithBalenaUrl: null,
    dependencies: [
      '@octokit/rest',
      'bluebird',
      'debug',
      'lodash',
      'moment',
      'simple-git',
      'tmp'
    ],
    screenshot: null,
    codeOfConduct: null,
    owner: {
      avatar: 'https://avatars.githubusercontent.com/u/17724750?v=4',
      handle: 'balena-io-modules',
      url: 'https://github.com/balena-io-modules',
      type: 'Organization'
    },
    examples: '',
    highlights: '',
    motivation: '',
    setup: '',
    installationSteps: null,
    hardwareRequired: '',
    softwareRequired: '',
    introduction: '',
    leftoverSections,
    readmeLeftover,
    tagline: '',
    docs: [
      {
        filename: 'docs/01-getting-started.md',
        contents: docsContent
      },
      { filename: 'docs/02-dummy.md', contents: docsDummyContent }
    ],
    blog: [
      {
        filename: 'blog/2019-07-08-hello-from-scrutinizer.md',
        contents: blogContent
      }
    ],
    readme,
    changelog: [
      {
        commits: [
          {
            subject: 'Populate more docs',
            hash: '777ef844be3cb81a4e52a784e29740c589547f30',
            body: '',
            footer: {
              'Change-type': 'minor',
              'change-type': 'minor'
            },
            author: 'Dimitrios Lytras'
          }
        ],
        version: '1.5.0',
        date: new Date('2019-09-17T13:39:46.818Z')
      },
      {
        commits: [
          {
            subject: 'Update blog to test versioning',
            hash: '9ca1caa2bb5311b5fc3a79008cca24e6430b8f6a',
            body: '',
            footer: {
              'Change-type': 'minor',
              'change-type': 'minor'
            },
            author: 'Dimitrios Lytras'
          }
        ],
        version: '1.4.0',
        date: new Date('2019-09-17T10:06:27.111Z')
      },
      {
        commits: [
          {
            subject: 'Update docs to test versioning',
            hash: 'f67bf137aa271aaf2baf8290dabcefa46ad46bce',
            body: '',
            footer: {
              'Change-type': 'minor',
              'change-type': 'minor'
            },
            author: 'Dimitrios Lytras'
          }
        ],
        version: '1.3.0',
        date: new Date('2019-09-17T09:51:57.404Z')
      },
      {
        commits: [
          {
            subject: 'Add more blog & docs',
            hash: '09d434d045822bda7db7ceeabf821c5eae7db4d0',
            body: '',
            footer: {
              'Change-type': 'minor',
              'change-type': 'minor'
            },
            author: 'Dimitrios Lytras'
          },
          {
            subject: 'Trigger new version',
            hash: 'eee589bb0901c504ed6d44407d81245d0510f9ad',
            body: '',
            footer: {
              'Change-type': 'patch',
              'change-type': 'patch'
            },
            author: 'Dimitrios Lytras'
          }
        ],
        version: '1.2.0',
        date: new Date('2019-09-17T09:41:52.933Z')
      }
    ],
    faq: null,
    maintainers: [ '@dimitrisnl' ],
    contributors: [
      {
        username: 'dimitrisnl',
        contributions: 16,
        avatar: 'https://avatars.githubusercontent.com/u/4951004?v=4'
      }
    ],
    openIssues: {
      numberOfIssues: 2,
      latestIssues: [
        {
          title: 'Issue #2',
          url:
            'https://github.com/balena-io-modules/scrutinizer-test-repo/issues/2'
        },
        {
          title: 'Issue #1',
          url:
            'https://github.com/balena-io-modules/scrutinizer-test-repo/issues/1'
        }
      ]
    }
  }
}

module.exports = data
