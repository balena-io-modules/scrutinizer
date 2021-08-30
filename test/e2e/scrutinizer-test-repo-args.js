'use strict';

/* eslint-disable max-len */
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
`;

const dummyContent = `# [](#dummy)Dummy

Test
`;

/* eslint-enable */

const data = {
	testIndex: 1,
	name: 'scrutinizer-test-repo',
	url: 'git@github.com:balena-io-modules/scrutinizer-test-repo',
	reference: 'e789054c637c957fb837691f81e5227faa5ebd82',
	plugins: ['docs', 'faq', 'github-metadata'],
	result: {
		name: 'scrutinizer-test-repo',
		description: "A dummy repository to run scrutinizer's test suite against",
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
			type: 'Organization',
		},
		docs: [
			// eslint-disable-next-line max-len
			{ filename: 'docs/01-getting-started.md', contents: docsContent },
			{ filename: 'docs/02-dummy.md', contents: dummyContent },
		],
		faq: null,
	},
};

module.exports = data;
