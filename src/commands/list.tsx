import React from 'react';
import { Argv } from "yargs";
import { render } from 'ink';
import { ArgShape } from "../rootCommand";
import { CLI, CreateFlow } from '../ui';

export const command = 'list';

export const desc = "View a list of all of your deployments.";

export function builder(args:Argv) {

}

export function handler(args:ArgShape) {
  render(
    <CLI args={args} renderFunc={(props) => <CreateFlow {...props} />} />
  )
}