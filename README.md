scrutinizor
==========

[![npm](https://img.shields.io/npm/v/scrutinizor.svg?style=flat-square)](https://npmjs.com/package/scrutinizor)
[![npm license](https://img.shields.io/npm/l/scrutinizor.svg?style=flat-square)](https://npmjs.com/package/scrutinizor)
[![npm downloads](https://img.shields.io/npm/dm/scrutinizor.svg?style=flat-square)](https://npmjs.com/package/scrutinizor)
[![travis](https://img.shields.io/travis/resin-io-modules/scrutinizor/master.svg?style=flat-square&label=linux)](https://travis-ci.org/resin-io-modules/scrutinizor)

> Extract a git repository's metadata relying on open source
> conventions

Installation
------------

Install `scrutinizor` by running:

```sh
npm install --save scrutinizor
```

Documentation
-------------


* [scrutinizor](#module_scrutinizor)
    * [.local(gitRepository, options)](#module_scrutinizor.local) ⇒ <code>Promise</code>
    * [.remote(gitRepository, options)](#module_scrutinizor.remote) ⇒ <code>Promise</code>

<a name="module_scrutinizor.local"></a>

### scrutinizor.local(gitRepository, options) ⇒ <code>Promise</code>
**Kind**: static method of [<code>scrutinizor</code>](#module_scrutinizor)  
**Summary**: Examine a local git repository directory  
**Access**: public  
**Fulfil**: <code>Object</code> - examination results  

| Param | Type | Description |
| --- | --- | --- |
| gitRepository | <code>String</code> | path to git repository |
| options | <code>Object</code> | options |
| options.reference | <code>String</code> | git reference to check |
| [options.progress] | <code>function</code> | progress callback (state) |

**Example**  
```js
scrutinizor.local('./foo/bar/baz', {
  reference: 'master',
  progress: (state) => {
    console.log(state.percentage)
  }
}).then((results) => {
  console.log(results)
})
```
<a name="module_scrutinizor.remote"></a>

### scrutinizor.remote(gitRepository, options) ⇒ <code>Promise</code>
If `$GITHUB_TOKEN` is set, it will be used to authenticate with
GitHub to increase rate-limiting.

**Kind**: static method of [<code>scrutinizor</code>](#module_scrutinizor)  
**Summary**: Examine a remote git repository url  
**Access**: public  
**Fulfil**: <code>Object</code> - examination results  

| Param | Type | Description |
| --- | --- | --- |
| gitRepository | <code>String</code> | git repository url |
| options | <code>Object</code> | options |
| options.reference | <code>String</code> | git reference to check |
| [options.progress] | <code>function</code> | progress callback (state) |

**Example**  
```js
scrutinizor.remote('git@github.com:foo/bar.git', {
  reference: 'master',
  progress: (state) => {
    console.log(state.percentage)
  }
}).then((results) => {
  console.log(results)
})
```

Tests
-----

Our test suite contains integration test cases that run this module against
real projects. For that reason, we maintain a set of git submodules in
`test/repositories`, where the actual test cases that assert their results live
in `test/e2e`.

1. Fetch all git submodules

```sh
git submodule update --init --recursive
```

2. Set `$GITHUB_TOKEN`, to increase rate-limiting

3. Run the `test` npm script:

```sh
npm test
```

You may enable debug information by setting `DEBUG=scrutinizor*`.

Contribute
----------

- Issue Tracker: [github.com/resin-io-modules/scrutinizor/issues](https://github.com/resin-io-modules/scrutinizor/issues)
- Source Code: [github.com/resin-io-modules/scrutinizor](https://github.com/resin-io-modules/scrutinizor)

Before submitting a PR, please make sure that you include tests, and that the
linter runs without any warning:

```sh
npm run lint
```

One of the most valuable things you can contribute to this project is implement
or improve plugins, which are small functions whose duty is to extract a
certain facet about the repository, like license information.

1. Create a new file in `lib/plugins`, like `myplugin.js`

2. Export a function that takes a single argument, `backend`, which contains
every function you need to interact with a git repository, like reading a file

Make sure you use the `backend` object instead of falling back to `fs` or an
API call, so the plugin works fine in both local and remote modes.

You can do whatever you need here, including checking out other branches.
`scrutinizor` will make sure the project is properly reset before calling
another plugin.

3. Add the new plugin to `BUILTIN_PLUGINS` in `lib/index.js`

4. Update test cases in `test/e2e`

Support
-------

If you're having any problem, please [raise an issue][newissue] on GitHub.

License
-------

This project is free software, and may be redistributed under the terms
specified in the [license].

[newissue]: https://github.com/resin-io-module/scrutinizor/issues/new
[license]: https://github.com/resin-io-module/scrutinizor/blob/master/LICENSE
