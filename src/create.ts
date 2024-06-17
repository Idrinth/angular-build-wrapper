import ValueStore from "./value-store";
import {existsSync, writeFileSync} from "node:fs";
import {readFileSync} from "fs";

export default (values: ValueStore) => {
  const filler = {};
  const types = {};
  for (const key of values.desired) {
    filler[key] = values.get(key);
    types[key] = 'string';
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
  if (! existsSync(values.cwd + '/.idrinth-angular-build-wrapper.json')) {
    writeFileSync(
      values.cwd + '/.idrinth-angular-build-wrapper.json',
      JSON.stringify({
        desired: [],
        defaults: {
          all: {},
          dev: {},
          build: {},
          test: {},
        }
      }, null, 2),
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
