#!/usr/bin/env node

/*
 * Copyright 2018 resin.io
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

import { state, globalOption, command, run } from "capitano";
import * as scrutinizer from "../lib";
import { isUndefined, isString } from "lodash";

const showHelp = () => {
  console.error("Usage: scrutinizer <path> [--reference=master]");

  console.log("\nGlobal Options:\n");
  for (const option of state.globalOptions) {
    console.log(
      `\t  ${option.alias ? `-${option.alias}, ` : ""}--${option.signature}`
    );
    if (option.description) console.log(`\t\t${option.description}`);
  }

  console.log("Commands:\n");
  for (const command of state.commands) {
    if (command.isWildcard()) continue;

    console.log(`\t${command.signature}\t\t${command.description}`);
    for (const option of command.options) {
      console.log(
        `\t  ${option.alias ? `-${option.alias}, ` : ""}--${option.signature}`
      );
      if (option.description) console.log(`\t\t${option.description}`);
    }
  }
};

const prettyPrint = (obj: object) => {
  console.log(JSON.stringify(obj, null, 2));
};

const parsePlugins = (plugins: string) => {
  if (isUndefined(plugins) || !isString(plugins)) return [];
  return plugins.split(" ");
};

globalOption({
  signature: "help",
  alias: ["h"],
  boolean: true,
  required: false,
});

globalOption({
  signature: "reference",
  parameter: "reference",
  alias: ["r"],
  required: false,
  description: "Git reference to scrutinize",
});

command({
  signature: "*",
  action: () => {
    showHelp();
    process.exit(1);
  },
});

command({
  signature: "local <path> [plugins...]",
  description: "Retrieve metadata about a local checkout of a repo",
  action: (
    { path, plugins }: { path: string; plugins: string },
    { help, reference = "master" }: { help: string; reference: string }
  ) => {
    if (help) {
      showHelp();
      process.exit(1);
    }

    scrutinizer
      .local(path, {
        reference,
        whitelistPlugins: parsePlugins(plugins),
      })
      .then((result) => {
        return prettyPrint(result);
      });
  },
});

command({
  signature: "remote <url> [plugins...]",
  description:
    "Retrieve metadata about a remote repo. Set `GITHUB_TOKEN` as an env var for GitHub lookup",
  action: (
    { url, plugins }: { url: string; plugins: string },
    { help, reference = "master" }: { help: string; reference: string }
  ) => {
    if (help) {
      showHelp();
      process.exit(1);
    }

    scrutinizer
      .remote(url, {
        reference,
        whitelistPlugins: parsePlugins(plugins),
      })
      .then((result) => {
        return prettyPrint(result);
      });
  },
});

run(process.argv, (err: string) => {
  if (!err) return;

  showHelp();
  throw err;
});
