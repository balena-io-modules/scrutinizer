'use strict'

const data = {
  name: 'scrutinizer-test-repo',
  url: 'git@github.com:balena-io-modules/scrutinizer-test-repo',
  reference: 'e789054c637c957fb837691f81e5227faa5ebd82',
  plugins: [ 'docs', 'faq', 'github-metadata' ],
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
    owner: {
      avatar: 'https://avatars.githubusercontent.com/u/17724750?v=4',
      handle: 'balena-io-modules',
      url: 'https://github.com/balena-io-modules',
      type: 'Organization'
    },
    docs: [
      // eslint-disable-next-line max-len
      { filename: 'docs/01-getting-started.md', contents: 'Getting Started\n===============\n\nWelcome to Landr! Setting up Landr in your project is extremely easy. First,\nmake sure you install the `landr` CLI from npmjs.org if you haven\'t already by\nrunning:\n\n```sh\nnpm install --global landr\n```\n\nLets also install the excellent [`serve`](https://www.npmjs.com/package/serve)\nstatic HTTP server as a way to preview our site:\n\n```sh\nnpm install --global serve\n```\n\nNow that everything is in place, head over to your project\'s repository and\nrun:\n\n```sh\nlandr build\n```\n\nGive it a bunch of seconds, and you should get various HTML, CSS, and\nJavaScript files in the `dist` directory. You can preview your site by running:\n\n```sh\nserve dist\n```\n\nAnd pointing your browser to `localhost:5000`.\n\nAt this point, you have working, but not perfect, website. Landr generates\nwebsites based on the content of the repository and relies on various OSS\nconventions for doing its job. Making sure your repository is well structured\nand follows the community conventions will do wonders for you website, and for\nyour repository overall!\n\nOnce you are happy with your site, run the following command to deploy to Netlify:\n\n```\nNETLIFY_AUTH_TOKEN=<token> landr deploy\n```\n\nPassing your Netlify authentication token as an environment variable.\n\nVersion 2\n' },
      { filename: 'docs/02-dummy.md', contents: 'Dummy\n=====\n\nTest\n' }
    ],
    faq: null
  }
}

module.exports = data
