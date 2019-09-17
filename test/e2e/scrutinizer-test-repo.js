'use strict'

const data = {
  name: 'scrutinizer-test-repo',
  url: 'git@github.com:balena-io-modules/scrutinizer-test-repo',
  reference: 'e789054c637c957fb837691f81e5227faa5ebd82',
  result: {
    name: 'scrutinizer-test-repo',
    description: 'A dummy repository to run scrutinizer\'s test suite against',
    public: true,
    fork: false,
    stars: 0,
    homepage: null,
    repositoryUrl:
      'https://github.com/balena-io-modules/scrutinizer-test-repo.git',
    active: true,
    license: 'Apache-2.0',
    contributing:
      'This is a placeholder file.\n\nWe strongly urge you to checkout [Scrutinizer](https://github.com/balena-io-modules/scrutinizer) instead.\n',
    architecture: null,
    security: null,
    lastCommitDate: '2019-09-17T13:42:54Z',
    latestRelease: null,
    latestPreRelease: null,
    dependencies: [
      '@octokit/rest',
      'bluebird',
      'debug',
      'lodash',
      'moment',
      'simple-git',
      'tmp'
    ],
    codeOfConduct: null,
    owner: {
      avatar: 'https://avatars0.githubusercontent.com/u/17724750?v=4',
      handle: 'balena-io-modules',
      url: 'https://github.com/balena-io-modules',
      type: 'Organization'
    },
    motivation: null,
    installationSteps: null,
    readme:
      'scrutinizer-test-repo\n===========\n\nThis repository serves as a playground for [Scrutinizer](https://github.com/balena-io-modules/scrutinizer).\n\nScrutinizer\'s test suite relies on various metadata including \'Integrations\' and more. These properties can change at any time in an active project. Consequently, this repository will serve as a predictable point of reference for our tests.\n',
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
        avatar: 'https://avatars2.githubusercontent.com/u/4951004?v=4'
      },
      {
        username: 'balena-ci',
        avatar: 'https://avatars0.githubusercontent.com/u/34882892?v=4'
      }
    ]
  }
}

module.exports = data
