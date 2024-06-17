import {
  exec
} from "node:child_process";
import ValueStore from "./value-store";
import {existsSync} from "node:fs";

export default (values: ValueStore) => {
  const options = { encoding: 'utf8', env: process.env, cwd: values.cwd };
  if (existsSync(values.cwd + '/node_modules/.bin/ng')) {
    console.log('ng ' + values.passed().join(' '));
    const child = exec('node node_modules/.bin/ng ' + values.passed().join(' '), options)
      .on('error', (err) => {console.error(err)})
      .on('exit', (code) => {process.exit(code)});
    child.stdout.on('data', (data) => console.log(data));
    child.stderr.on('data', (data) => console.error(data));
    return;
  }
  console.log('ng ' + values.passed().join(' '));
  const child = exec('ng ' + values.passed().join(' '), options)
    .on('error', (err) => {console.error(err)})
    .on('exit', (code) => {process.exit(code)});
  child.stdout.on('data', (data) => console.log(data));
  child.stderr.on('data', (data) => console.error(data));
}
