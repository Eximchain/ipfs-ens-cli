import React from 'react';
import { Argv } from "yargs";
import { render } from 'ink';
import { ListDeployments } from '@eximchain/ipfs-ens-types/spec/methods/private';
import { ArgShape } from "../deployer";
import { CLI, CreateFlow, PrettyRequest } from '../ui';

export const command = 'list';

export const desc = "View a list of all of your deployments.";

export function builder(args:Argv) {

}

export function handler(args:ArgShape) {
  render(
    <CLI args={args} renderFunc={({ API }) => {
      return (
        <PrettyRequest 
          operation={`${ListDeployments.HTTP} ${ListDeployments.Path}`}
          resource={() => API.deploys.list.resource()} />
      )
    }} />
  )
}