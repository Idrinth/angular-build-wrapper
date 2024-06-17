import {
  config,
} from 'dotenv';
import ValueStore from "./src/value-store";
import create from "./src/create";
import runner from "./src/runner";
import help from "./src/help";

config();

const values = new ValueStore(process.env, process.argv, process.cwd());
switch (values.command) {
  case 'test':
  case 'build':
  case 'serve':
    await create(values);
    runner(values);
    break;
  case 'create':
    await create(values, true);
    process.exit(0);
    break;
  case 'help':
  default:
    help();
    process.exit(0);
}
