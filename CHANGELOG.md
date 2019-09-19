# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## v1.1.0 - 2018-01-17

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
