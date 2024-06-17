import {existsSync} from "node:fs";
import {readFileSync} from "fs";

export default class ValueStore {
  private readonly passThru: string[];
  private readonly usable: string[];
  public readonly command: 'build'|'serve'|'help'|'test'|'create';
  private readonly defaults: { all:  { [key: string]: string }; test:  { [key: string]: string }; dev:  { [key: string]: string }; build:  { [key: string]: string } };
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
      dev: {},
      all: {},
    }
    this.desired = [];
    if (existsSync(cwd + '/.idrinth-angular-build-wrapper.json')) {
      const data = JSON.parse(readFileSync(cwd + '/.idrinth-angular-build-wrapper.json', 'utf8'));
      this.desired = data?.desired ?? [];
      this.defaults.all = data?.defaults?.all ?? {};
      this.defaults.build = data?.defaults?.build ?? {};
      this.defaults.test = data?.defaults?.test ?? {};
      this.defaults.dev = data?.defaults?.dev ?? {};
    }
    this.defaults.all.iabwBuiltTime = new Date().toISOString();
    this.desired.push('iabwBuiltTime');
  }
  get(key: string): string
  {
    for (const value of this.usable) {
      if (value.startsWith('--'+key+'=')) {
        return value.substring(key.length + 2);
      }
    }
    if (typeof this.env[key] !== 'undefined') {
      return this.env[key];
    }
    if (typeof this.env[key] !== 'undefined') {
      return this.env[key];
    }
    if (typeof this.defaults?.[this.command]?.[key] !== 'undefined') {
      return this.defaults?.[this.command]?.[key];
    }
    if (typeof this.defaults.all[key] !== 'undefined') {
      return this.defaults.all[key];
    }
    throw new Error(`Unknown key: ${key}`);
  }
  passed(): string[]
  {
    return [this.command, ...this.passThru];
  }
}
