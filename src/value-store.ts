import {existsSync,readFileSync} from "node:fs";
import {Case} from "change-case-all";
import {FILE_NAME} from "./constants";

export default class ValueStore {
  private readonly passThru: string[];
  private readonly usable: string[];
  public readonly command: 'build'|'serve'|'help'|'test'|'create';
  private readonly defaults: { all:  { [key: string]: string }; test:  { [key: string]: string }; serve:  { [key: string]: string }; build:  { [key: string]: string } };
  public readonly desired: string[];
  constructor(
    private readonly env: { [key: string]: string },
    args: string[],
    public readonly cwd: string,
  ) {
    this.command = ['build', 'test', 'serve', 'create'].includes(args[2]) ? args[2] as 'build'|'test'|'serve'|'create' : 'help';
    this.usable = args.slice(3, args.includes('--') ? args.indexOf('--') : args.length);
    this.passThru = args.slice(args.includes('--') ? args.indexOf('--') : args.length);
    this.defaults = {
      build: {},
      test: {},
      serve: {},
      all: {},
    }
    this.desired = [];
    if (existsSync(cwd + '/' + FILE_NAME)) {
      const data = JSON.parse(readFileSync(cwd + '/' + FILE_NAME, 'utf8'));
      this.desired = data?.desired ?? [];
      this.defaults.all = data?.defaults?.all ?? {};
      this.defaults.build = data?.defaults?.build ?? {};
      this.defaults.test = data?.defaults?.test ?? {};
      this.defaults.serve = data?.defaults?.serve ?? {};
    }
    this.defaults.all.iabwBuiltTime = new Date().toISOString();
    this.desired.push('iabwBuiltTime');
  }
  get(key: string): string
  {
    for (const value of this.usable) {
      if (value.startsWith('--'+Case.kebab(key)+'=')) {
        return value.substring(Case.kebab(key).length + 2);
      }
    }
    if (typeof this.env[Case.constant(key)] !== 'undefined') {
      return this.env[Case.constant(key)];
    }
    if (typeof this.defaults?.[this.command]?.[Case.snake(key)] !== 'undefined') {
      return this.defaults?.[this.command]?.[Case.snake(key)];
    }
    if (typeof this.defaults.all[Case.snake(key)] !== 'undefined') {
      return this.defaults.all[Case.snake(key)];
    }
    throw new Error(`Unknown key: ${key}`);
  }
  passed(): string[]
  {
    return [this.command, ...this.passThru];
  }
}
