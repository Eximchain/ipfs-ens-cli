import React from 'react';
import { Argv } from "yargs";
import { render } from 'ink';
import { ArgShape } from "../deployer";
import { CLI, CreateFlow } from '../ui';

export const command = 'read <EnsName>';

export const desc = "Read the details about one of your deployments.";

export function builder(args:Argv) {

}

export function handler(args:ArgShape) {
  render(
    <CLI args={args} renderFunc={(props) => <CreateFlow {...props} />} />
  )
}