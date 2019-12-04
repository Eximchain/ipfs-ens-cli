import React from 'react';
import { Argv } from "yargs";
import { render } from 'ink';
import { ArgShape } from "../rootCommand";
import { CLI, LoginFlow } from '../ui';

export const command = 'login';

export const desc = "Interactive command to login, authorize the Deployer, and save the auth to your machine.";

export function builder(args:Argv) {

}

export function handler(args:ArgShape) {
  render(
    <CLI args={args} renderFunc={(props) => <LoginFlow {...props} />} />
  )
}