import ValueStore from "./value-store";
import {existsSync, writeFileSync, readFileSync} from "node:fs";
import {camelCase} from "change-case-all";
import question from "./question";
import {FILE_NAME} from "./constants";

export default async(values: ValueStore, ask: boolean = false) => {
  const filler = {};
  const types = {};
  for (const key of values.desired) {
    filler[camelCase(key)] = values.get(key);
    types[camelCase(key)] = 'string';
  }
  writeFileSync(
    values.cwd + '/src/configuration.d.ts',
    `interface Configuration ${JSON.stringify(types, null, 2).replace(/"(.*?)":/g, '$1:').replace(/: "string"/g, ': string')}\n\nconst configuration: Configuration;\n\nexport default configuration;`,
    'utf8',
  );
  writeFileSync(
    values.cwd + '/src/configuration.js',
    `export default ${JSON.stringify(filler)};`,
    'utf8',
  );
  if (! existsSync(values.cwd + '/' + FILE_NAME)) {
    const config = {
      desired: [],
      defaults: {
        all: {},
        serve: {},
        build: {},
        test: {},
      }
    };
    if (ask) {
      while (true) {
        const value = await question('Enter the camelCase name of a desired configuration value, leave empty to skip: ');
        if (! value) {
          break;
        }
        config.desired.push(value);
        const serve = await question('Enter a default value for serve or leave empty to skip: ');
        if (serve) {
          config.defaults.serve[value] = serve;
        }
        const build = await question('Enter a default value for build or leave empty to skip: ');
        if (build) {
          config.defaults.build[value] = build;
        }
        const test = await question('Enter a default value for serve or leave empty to skip: ');
        if (test) {
          config.defaults.test[value] = test;
        }
        const all = await question('Enter a default value for all or leave empty to skip: ');
        if (all) {
          config.defaults.all[value] = all;
        }
      }
    }
    writeFileSync(
      values.cwd + '/' + FILE_NAME,
      JSON.stringify(config, null, 2),
      'utf8'
    );
  }
  if (existsSync(values.cwd + '/.gitignore')) {
    const ignore = readFileSync(values.cwd + '/.gitignore', 'utf8');
    if (! ignore.includes('\n/src/configuration.js\n')) {
      writeFileSync(
        values.cwd + '/.gitignore',
        ignore + '\n/src/configuration.js\n',
        'utf8'
      );
    }
  }
};
