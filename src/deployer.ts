#!/usr/bin/env node
import yargs, { Arguments } from 'yargs';
import fs from 'fs';
import path from 'path';

export const npmPackage = JSON.parse(fs.readFileSync(path.resolve(__dirname, './../package.json')).toString());

export interface UniversalArgs {
  
}

export interface AdditionalArgs {
  [key:string]: any
}

export type ArgShape<Additional = AdditionalArgs> = Arguments<UniversalArgs & Additional>;

yargs
  .usage('Usage: deployer <command>')
  .commandDir('commands')
  .demandCommand(1)
  .help('help')
  .alias('help', 'h')
  .hide('help')
  .hide('version')
  .version(npmPackage.version)
  .alias('version', 'v')
  .epilog('Made by Eximchain Pte. Ltd.')
  .config('config', "Path to a JSON config file; defaults to './ipfsEnsConfig.json'.  \nAll of the file's keys will be treated like options.")
  .wrap(Math.min(yargs.terminalWidth(), 160))
  .argv