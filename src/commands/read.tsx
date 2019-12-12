import React, { useEffect } from 'react';
import yargs, { Argv } from "yargs";
import { render } from 'ink';
import { ReadDeployment } from '@eximchain/ipfs-ens-types/spec/methods/private';
import { ArgShape } from "../deployer";
import { CLI, CreateFlow, PrettyRequest, DeployDetails } from '../ui';
import { useDispatch } from 'react-redux';
import { DeployActions } from '../state';

export const command = 'read <EnsName>';

export const desc = "Read the details about one of your deployments.";

export function builder(args:Argv) {
  yargs
    .positional('EnsName', {
      describe: "Your deployment's subdomain name",
      type: 'string'
    })
}

export function handler(args:ArgShape<{ EnsName: string }>) {
  const { EnsName } = args;
  render(
    <CLI args={args} renderFunc={() => {
      const dispatch = useDispatch();
      useEffect(function fetchOnMount(){
        dispatch(DeployActions.fetchDeploy(EnsName));
      }, [])
      return (
        <DeployDetails ensName={EnsName} />
      )
    }} />
  )
}