# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## v1.1.0 - 2018-01-17

## 5.0.0 - 2022-04-13

* Fix assets typo in latestRelease [Amit Solanki]

## 4.11.4 - 2022-04-13

* Recognize tar.gz releases and linux archs [Amit Solanki]

## 4.11.3 - 2022-04-12

* Read links.json [Amit Solanki]

## 4.11.2 - 2022-04-12

* Handle absolute urls while embedding images in MD [Amit Solanki]

## 4.11.1 - 2022-04-12

* Remove mmmagic package and it's usage [Amit Solanki]

## 4.11.0 - 2022-04-04

* Fallback to fs-copy, if the source is not a repo [Amit Solanki]

## 4.10.1 - 2022-03-21

* Support github markdown format across all md files [Amit Solanki]

## 4.10.0 - 2022-02-15

* Add table support to extracted markdown [Amit Solanki]

## 4.9.0 - 2022-02-15

* Refactor markdown parsing [Amit Solanki]

## 4.8.1 - 2022-02-14

* Add debug logs to tesseract calls [Amit Solanki]

## 4.8.0 - 2022-02-09

* Add "terms of service", "master agreement" and "privacy policy" plugins [Amit Solanki]

## 4.7.5 - 2022-02-07

* Fix extracted repo path for local mode [Amit Solanki]

## 4.7.4 - 2022-02-07

* Fetch repo data from url instead of relying on initial data [Amit Solanki]

## 4.7.3 - 2022-02-06

* Add debug to fs backend [Amit Solanki]

## 4.7.2 - 2022-02-05

* Log repo cloning [Amit Solanki]

## 4.7.1 - 2022-02-05

* Fix org logo fetch [Amit Solanki]

## 4.7.0 - 2022-02-05

* Embed images as base64 into docs and blog md files [Amit Solanki]

## 4.6.0 - 2022-02-03

* Fix local mode, refactor image loading [Amit Solanki]

## 4.5.0 - 2022-01-31

* Provide option to clone a repo before running in local mode [Amit Solanki]

## 4.4.2 - 2022-01-09

* Return blank array when no contributors are found [Amit Solanki]

## 4.4.1 - 2022-01-08

* Determine repo url via git in local mode [Amit Solanki]

## 4.4.0 - 2022-01-06

* Fallback to github when possible in FS [Amit Solanki]

## 4.3.0 - 2022-01-06

* Export util method to download a repos zip [Amit Solanki]

## 4.2.2 - 2022-01-05

* Fix SVG logo image type [Amit Solanki]

## 4.2.1 - 2021-12-20

* Handle file size too large issue for remote calls [Amit Solanki]

## 4.2.0 - 2021-12-20

* Add github context option for remote calls [Amit Solanki]

## 4.1.0 - 2021-12-14

* Mark text and code in installation steps [Amit Solanki]

## 4.0.0 - 2021-11-28

* Fallback to markdown changelog if yml changelog is not present [Lucian Buzzo]

## 3.13.0 - 2021-11-28

* Add org contract plugin [Amit Solanki]

## 3.12.2 - 2021-11-28

* Fix github backend types [Amit Solanki]

## 3.12.1 - 2021-11-28

* Update dependencies [Amit Solanki]

## 3.12.0 - 2021-11-28

* Update octokit/rest api package [Amit Solanki]

## 3.11.1 - 2021-11-23

* Remove nodegit [Amit Solanki]

## 3.11.0 - 2021-10-28

* Fix logo fetch from README [Amit Solanki]

## 3.10.1 - 2021-10-20

* Wait for sections promise in faqs [Amit Solanki]

## 3.10.0 - 2021-10-20

* Add markdown frontmatter [Amit Solanki]

## 3.9.0 - 2021-10-15

* Force base64 on images [Amit Solanki]

## 3.8.0 - 2021-10-15

* Add table of contents to blog [Amit Solanki]

## 3.7.0 - 2021-10-14

* Add contracts plugin [Amit Solanki]

## 3.6.0 - 2021-10-14

* Improve image path detection [Amit Solanki]

## 3.5.0 - 2021-10-13

* Add netlify config plugin [Amit Solanki]

## 3.4.2 - 2021-10-13

* Use snapshots for testing [Amit Solanki]

## 3.4.1 - 2021-10-07

* Fetch files from master branch in org repo [Amit Solanki]

## 3.4.0 - 2021-10-07

* Add balena.yml and org-repo plugin [Amit Solanki]

## 3.3.0 - 2021-09-20

* Disable linking headers in markdown [Amit Solanki]

## 3.2.0 - 2021-09-16

* List table of contents of docs [Amit Solanki]

## 3.1.0 - 2021-08-31

* Drop node 10 support [Amit Solanki]

## 3.0.1 - 2021-08-30

* Fix npm publish [Amit Solanki]

## 3.0.0 - 2021-08-30

* Move to typescript [Amit Solanki]

## 2.4.2 - 2021-08-30

* Only test for node versions 10 & 12. [Carlo Miguel Cruz]

## 2.4.1 - 2021-07-15

* Upgrade nodegit version [Amit Solanki]

## 2.4.0 - 2021-06-01

* Auto link headings [Amit Solanki]

## 2.3.3 - 2021-04-21

* Fix regex replace [Amit Solanki]

## 2.3.2 - 2021-04-21

* Remove tagline from leftover readme [Amit Solanki]

## 2.3.1 - 2021-04-20

* Encode brandmark logo into base64 [Amit Solanki]

## 2.3.0 - 2021-04-19

* Mark leftover readme sections headers [Amit Solanki]

## 2.2.0 - 2021-04-19

* Extract tagline from readme [Amit Solanki]

## 2.1.4 - 2021-04-17

* Extract additional readme sections [Amit Solanki]

## 2.1.3 - 2021-04-16

* Fetch Brandmark logo from a repo [Amit Solanki]

## 2.1.2 - 2020-09-16

* Handle blank headings [Amit Solanki]

## 2.1.1 - 2020-09-11

* Handle blank headings in markdown [Amit Solanki]

## 2.1.0 - 2020-07-03

* Convert svg logo to png [Amit Solanki]

## 2.0.0 - 2020-06-25

* Detect and report deploy to balena buttons [Amit Solanki]
* MD is processed and returned as md instead of tree [Amit Solanki]

## 1.34.0 - 2020-06-24

* Support for all logo formats and sources [Amit Solanki]

## 1.33.0 - 2020-06-08

* Extract leftover readme sections [Amit Solanki]

## 1.32.0 - 2020-05-18

* List contributions count of contributors [Amit Solanki]

## 1.31.0 - 2020-04-14

* Use OCR to detect text in logo [Lucian Buzzo]

## 1.30.0 - 2020-04-14

* Add plugin filter to local and remote calls [Giovanni Garufi]

## 1.29.2 - 2020-04-11

* Add support for retrieving screenshots inside docker containers [Lucian Buzzo]

## 1.29.1 - 2020-04-06

* Don't try to log headers if they don't exist [Lucian Buzzo]

## 1.29.0 - 2019-11-15

* Group downloads by arch & os [Dimitrios Lytras]

## 1.28.1 - 2019-11-15

* Fix 'hightlights' parsing [Dimitrios Lytras]

## 1.28.0 - 2019-11-14

* screenshot: Allow GIFs [Dimitrios Lytras]

## 1.27.4 - 2019-11-04

* Add specific chromium path when running on alpine [Giovanni Garufi]

## 1.27.3 - 2019-10-25

* Fix Highlights parsing [Dimitrios Lytras]

## 1.27.2 - 2019-10-25

* fix: Parse the last FAQ item [Dimitrios Lytras]

## 1.27.1 - 2019-10-25

* Use base64 for screenshot [Dimitrios Lytras]

## 1.27.0 - 2019-10-25

* Fetch screenshot from repo [Dimitrios Lytras]

## 1.26.3 - 2019-10-24

* faq: Collect whole content of the entry [Dimitrios Lytras]

## 1.26.2 - 2019-10-23

* Fix logo parsing [Dimitrios Lytras]

## 1.26.1 - 2019-10-21

* example: Fix plugin metadata [Dimitrios Lytras]

## 1.26.0 - 2019-10-21

* readme: Parse Examples section [Dimitrios Lytras]

## 1.25.0 - 2019-10-21

* readme: Parse highlights [Dimitrios Lytras]

## 1.24.0 - 2019-10-21

* readme: Parse Introduction setion [Dimitrios Lytras]

## 1.23.1 - 2019-10-21

* readme: Get the full section contents [Dimitrios Lytras]

## 1.23.0 - 2019-10-21

* plugins: Parse 'Hardware/Software required' sections from readme [Dimitrios Lytras]

## 1.22.0 - 2019-10-08

* plugin: Get logo [Dimitrios Lytras]

## 1.21.2 - 2019-10-08

* Fix version parsing for non NPM projects [Dimitrios Lytras]

## 1.21.1 - 2019-10-03

* Improve directory scanning in local mode [Dimitrios Lytras]

## 1.21.0 - 2019-10-02

* plugin: Fetch version [Dimitrios Lytras]

## 1.20.1 - 2019-09-20

* contributors: Exclude balena-ci [Dimitrios Lytras]

## 1.20.0 - 2019-09-20

* plugin: Get # of open issues [Dimitrios Lytras]

## 1.19.0 - 2019-09-19

* Include filenames in doc & blog files [Dimitrios Lytras]

## 1.18.1 - 2019-09-19

* docs: Temporarily ignore subdirectories [Dimitrios Lytras]

## 1.18.0 - 2019-09-18

* Publish own scrutinizer data [Dimitrios Lytras]

## 1.17.0 - 2019-09-17

* Add Blog & Docs plugin [Dimitrios Lytras]

## 1.16.3 - 2019-09-17

* Update CODEOWNER & Docs tests [Dimitrios Lytras]

## 1.16.2 - 2019-09-17

* Bring e2e tests up to date [Dimitrios Lytras]

## 1.16.1 - 2019-09-13

* Fix: Use consistent camelCase for metadata [Dimitrios Lytras]

## 1.16.0 - 2019-09-12

* Gh-metadata: Expose Homepage, Repo URL, Active [Dimitrios Lytras]

## 1.15.0 - 2019-09-12

* Plugin: Parse SECURITY.md [Dimitrios Lytras]

## 1.14.0 - 2019-09-10

* Plugin: Fetch changelog [Dimitrios Lytras]

## 1.13.0 - 2019-09-10

* Readme-plugin: Add motivation && installationSteps parsers [Dimitrios Lytras]

## 1.12.0 - 2019-09-10

* Github-meta: Expose Owner & Stars amount [Dimitrios Lytras]

## 1.11.1 - 2019-09-10

* Config: Relax some es-lint rules [Dimitrios Lytras]

## 1.11.0 - 2019-09-06

* Plugin: Add CoC [Dimitrios Lytras]

## 1.10.0 - 2019-05-21

* Plugins: Get name & description [Dimitrios Lytras]

## 1.9.0 - 2019-05-20

* Plugin: Get Readme [Dimitrios Lytras]

## 1.8.1 - 2019-04-26

* Check if candidate is null when fetching prerelease [Giovanni Garufi]

## 1.8.0 - 2019-04-23

* Plugins: Add isFork plugin [Dimitrios Lytras]

## 1.7.0 - 2019-03-27

* Add getPreRelease plugin [Giovanni Garufi]
* Plugin: Introduce getLatestRelease [Dimitrios Lytras]

## 1.6.0 - 2019-03-26

* Cli: Add a CLI interface [John (Jack) Brown]
* Test: Use a dedicated repo for the test cases [Dimitrios Lytras]

## 1.5.0 - 2019-03-25

* Drop momentjs [Dimitrios Lytras]

## 1.4.0 - 2019-03-19

* Test: Use a dedicated repo for the test cases [Dimitrios Lytras]

## 1.3.2 - 2019-03-15

* Plugins/license: Stop throwing error if package.json is missing [John (Jack) Brown]

## 1.3.1 - 2019-03-14

* Maintenance: Remove leftover travis yaml file [Dimitrios Lytras]

## 1.3.0 - 2019-03-13

* Plugin: Introduce getLastCommitDate [Dimitrios Lytras]

## 1.2.0 - 2019-03-12

* Dependencies: Upgrade @octokit/rest [Dimitrios Lytras]

- Extract NPM dependencies from `package.json`

## v1.0.0 - 2018-01-17

- Read license information from `package.json`
- Try to find contributing guidelines in `docs/CONTRIBUTING.md`
- Try to find architecture docs in `ARCHITECTURE.md` or `docs/ARCHITECTURE.md`
- Check if a repository is in GitHub, and if so, whether is public or private
- Check configured integrations on a GitHub repository
