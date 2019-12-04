import React from 'react';
import { Argv } from "yargs";
import { render } from 'ink';
import { ArgShape } from "../cli";
import { App, CreateFlow } from '../ui';

export const command = 'onboarding';

export const desc = false;

export function builder(args:Argv) {

}

export function handler(args:ArgShape) {
  render(
    <>Welcome to IPFS-ENS Deployer</>
  )
}