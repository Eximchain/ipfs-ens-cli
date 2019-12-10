import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Argv } from "yargs";
import { render } from 'ink';
import { ArgShape } from "../deployer";
import { CLI, Rows, ChevronText } from '../ui';
import { DeployActions, DeploySelectors } from '../state/DeploysDuck';

export const command = 'api [newVal]';

export const desc = false;

interface NewVal {
  newVal?: string
}

export function builder(args:Argv) {

}

export function handler(args:ArgShape<NewVal>) {
  render(
    <CLI args={args} renderFunc={({ args }) => {
      const newVal = args.newVal;
      const dispatch = useDispatch();
      const savedApiUrl = useSelector(DeploySelectors.getApiUrl())

      useEffect(function updateIfProvided(){
        if (newVal) dispatch(DeployActions.setApiUrl(newVal))
      }, [newVal, savedApiUrl])

      if (newVal) {
        return (
          <Rows>
            <ChevronText>Updated your Deployer API endpoint to : {newVal}</ChevronText>
          </Rows>
        )
      } else {
        return (
          <Rows>
            <ChevronText>Your current Deployer API endpoint is : {savedApiUrl}</ChevronText>
            <ChevronText>If you would like to update it, call this command with a value.</ChevronText>
          </Rows>
        )
      }
    }} />
  )
}