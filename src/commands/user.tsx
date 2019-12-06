import React from 'react';
import { Argv } from "yargs";
import { render } from 'ink';
import { ArgShape } from "../deployer";
import { CLI, Rows, ChevronText, ItemList } from '../ui';
import { useSelector } from 'react-redux';
import { GitSelectors } from '../state';

export const command = 'user';

export const desc = "View the user which is currently logged in.";

export function builder(args:Argv) {

}

export function handler(args:ArgShape) {
  render(
    <CLI args={args} renderFunc={(props) => {
      const user = useSelector(GitSelectors.getUser());
      if (user) {
        const { login, name, email, type } = user;
        return (
          <ItemList items={{ login, name, email, type }} />
        )
      } else {
        return (
          <Rows>
            <ChevronText>There is no user logged in right now.</ChevronText>
            <ChevronText>Try calling 'deployer login'.</ChevronText>
          </Rows>
        )
      }
    }} />
  )
}