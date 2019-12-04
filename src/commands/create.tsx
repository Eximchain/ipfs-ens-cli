import React from 'react';
import { Argv } from "yargs";
import { render } from 'ink';
import { ArgShape } from "../cli";
import { App, CreateFlow } from '../ui';

export const command = 'create';

export const desc = "Interactive command for creating a new deployment.";

export function builder(args:Argv) {

}

export function handler(args:ArgShape) {
  render(
    <App args={args} renderFunc={(props) => <CreateFlow {...props} />} />
  )
}